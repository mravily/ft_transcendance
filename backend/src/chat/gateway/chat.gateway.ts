import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { AuthService } from 'src/auth/service/auth.service';
import { Socket, Server } from 'socket.io';
import { UserI } from 'src/chat/model/user.interface';
import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { PageI } from '../model/page.interface';
import { channelI, eventI } from 'src/chat/model/channel.interface';
import { MessageI } from '../model/message.interface';
import { PrismaService } from '../../prisma.service';
import { hashPassword, comparePasswords } from 'src/chat/utils/bcrypt';

@WebSocketGateway({ cors: { origin: ['http://localhost:3000', 'http://localhost:4200'] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {

  @WebSocketServer()
  server: Server;

  connectedUsers: Map<string, Set<string>> = new Map();

  constructor(
private db: PrismaService) { }

  async onModuleInit() {
  }

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(socket.handshake.headers.authorization);
      const user: UserI = await this.userService.getUser(decodedToken.user.id);
      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user; // save user in socket 
        // Save connection
        if (!this.connectedUsers.has(user.login)) {
          this.connectedUsers.set(user.login, new Set());
        }
        this.connectedUsers.get(user.login).add(socket.id);
        // Only emit channels to the specific connected client
        this.onPaginatechannel(socket, { page: 1, limit: 10 });
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    // remove connection from DB
    this.connectedUsers.get(socket.data.user.login).delete(socket.id);
    if (this.connectedUsers.get(socket.data.user.login).size === 0) {
      this.connectedUsers.delete(socket.data.user.login);
    }
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  //  Trucs qui restent à faire dans le code au 21.09.2022 
  //  - Mute (un channel mute quelqu'un) : OK
  //  - block (mute quelque soit le channel) et 
  //  - Ban (plus d'accès au channel) d'écrire les messages : kicke le gars + rend channel invisible 
  //  - Permettre au channel creator de changer le mot de passe et de supprimer le mot de passe
  //  - Faire en sorte que le channel creator d'un channel soit aussi admin
  //  - Faire un mécanisme de succession lorsque le channel creator quitte la channel pour qu'un autre admin devienne channel creator
    
  @SubscribeMessage('getPublicChannels')
  async onGetPublicchannels(socket: Socket, page) {
    const channels = await this.db.getPublicChannels();
    return this.server.to(socket.id).emit('publicChannels', channels);
  }

  @SubscribeMessage('searchPublicChannels')
  async onSearchPublicchannels(socket: Socket, key: string) {
    const channels: string[]  = await this.db.getPublicChannels();
    let res: string[] = [];
    for (const channel of channels) {
      if (channel.includes(key)) {
        res.push(channel);
      }
    }
    return this.server.to(socket.id).emit('publicChannels', channels);
  }
  
  @SubscribeMessage('createChannel')
  async onCreatechannel(socket: Socket, channel: channelI) {
    let user: string = socket.data.user.login;
    if ("password" in channel) {
      channel.password = hashPassword(channel.password);
    }
    const createdchannel: channelI = await this.db.setChannel(channel); // A intégrer aux proto de Juan

    for (const user of createdchannel.users) {
      const socketIds: Set<string> = this.connectedUsers.get(user);
      const channels = await this.db.getChannelsForUser(user, { page: 1, limit: 10 });
      // substract page -1 to match the angular material paginator
      channels.meta.currentPage = channels.meta.currentPage - 1;
      for (const socketId of socketIds) {
        await this.server.to(socketId).emit('channels', channels);
      }
    }
  }

  @SubscribeMessage('getMyChannels')
  async onPaginatechannel(socket: Socket, page: PageI) {
    const channels = await this.db.getChannelsForUser(socket.data.user.login, this.handleIncomingPageRequest(page));
    // substract page -1 to match the angular material paginator
    channels.meta.currentPage = channels.meta.currentPage - 1;
    return this.server.to(socket.id).emit('channels', channels);
  }

  @SubscribeMessage('joinChannel')
  async onJoinchannel(socket: Socket, channelInfo: {name: string, password: string}) {
    // utilisateur autorisé ?
    const channel: channelI = await this.db.getChannel(channelInfo.name);
    if (!channel || channel.isPrivate) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (socket.data.user.login in channel.bannedUsers)
    {
      let mute : eventI = this.db.getBanInfo(socket.data.user.login, channel.name);
      if (mute.eventDate.getDate() + mute.eventDuration > Date.now())
      {
        this.db.unBanUser(socket.data.user.login, channel.name);
      }
      else
        return socket.emit('Error', new UnauthorizedException());      
    }
    if ("password" in channel && comparePasswords(channelInfo.password, channel.password)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    await this.db.setJoinChannel(socket.data.user.login, channel.name);
    const createdMessage: MessageI = await this.db.setMessage({
      isNotif: true,
      text: socket.data.user.login + " a rejoint le channel",
      user: channelName,
      channel: channelName,
      createdAt: Date.now()
    });
    this.sendToChan(channel.name, 'message', createdMessage);
    const messages = await this.db.getMessagesForchannel(channel, { limit: 10, page: 1 }); //
    messages.meta.currentPage = messages.meta.currentPage - 1;
    await this.server.to(socket.id).emit('messages', messages);
    channel.users = await this.db.getChannelUsers(channel.name);
    this.sendToChan(channel.name, 'channelMembers', channel.users);
  }
  
  @SubscribeMessage('updatePassword')
  async onUpdatePassword(socket: Socket, channelInfo: {name: string, password?: string}) {
    // utilisateur autorisé ?
    const channel: channelI = await this.db.getChannel(channelInfo.name);
    if (!channel || !this.db.isCreator(socket.data.user.login))
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    if (password in channelInfo) {
      channel.password = hashPassword(channelInfo.password);
      this.db.setChannelPass(channel.name, channel.password);
    }
    else {
      this.db.removeChannelPass(channel.name);
    }
  }
  
  @SubscribeMessage('leaveChannel')
  async onLeavechannel(socket: Socket, channelName: string) {
    // if (!(this.db.isOnChan(socket.data.user.login))
    if (!(socket.data.user.login in this.db.getChannelUsers(channelName)))
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    await this.db.setLeaveChannel(socket.data.user.login, channelName);
    this.sendNotif(socket.data.user.login + " left the channel", channelName);
  }

  @SubscribeMessage('addMember')
  async onAddMember(socket: Socket, channelName: string, login: string) {
    let channel: channelI = await this.db.getChannel(channelName);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!(socket.data.user.login in channel.admins)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    this.db.setJoinChannel(login, channelName);
    channel = await this.db.getChannel(channelName);
    this.sendToChan(channelName, 'channelInfo', channel);
  }

  @SubscribeMessage('promoteToAdmin') // muteEvent
  async onPromoteToAdmin(socket: Socket, promoteInfo: {channelName: string, login: string}) {
    let channel: channelI = await this.db.getChannel(promoteInfo.channelName);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!this.db.isAdmin(socket.data.user.login, promoteInfo.channelName)
        || this.db.isAdmin(promoteInfo.login, promoteInfo.channelName)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    this.db.setMakeAdmin(promoteInfo.login, promoteInfo.channelName);
    this.sendNotif(promoteInfo.login + " is now an admin", promoteInfo.channelName);
  }

  @SubscribeMessage('getChannelInfo')
  async onGetChannelInfo(socket: Socket, channelName: string) {
    const channel: channelI = await this.db.getChannel(channelName);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!(socket.data.user.login in channel.users)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    socket.emit('channelInfo', channel);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: MessageI) {
    const channel: channelI = await this.db.getChannel(message.channel);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!(socket.data.user.login in channel.users)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (socket.data.user.login in channel.mutedUsers)
    {
      let mute : eventI = this.db.getMuteInfo(socket.data.user.login, channel.name);
      if (mute.eventDate.getDate() + mute.eventDuration > Date.now())
      {
        this.db.unMuteUser(socket.data.user.login, channel.name);
      }
      else
        return socket.emit('Error', new UnauthorizedException());      
    }
    const createdMessage: MessageI = await this.db.setMessage({...message, user: socket.data.user.login, isNotif: false});
    this.sendToChan(createdMessage.channel, 'message', createdMessage);
  }

  async sendToChan(channelName: string, command: string, data: any) {
    const users = await this.db.getChannelUsers(channelName);
    for (const user of users) {
      const socketids: Set<string> = this.connectedUsers.get(user.login);
      for (const socketId of socketids) {
        await this.server.to(socketId).emit(command, data);
      }
    }
  }

  sendNotif(text: string, channelName: string) {
    const createdMessage: MessageI = await this.db.setMessage({
      isNotif: true,
      text: text,
      user: channelName,
      channel: channelName,
      createdAt: Date.now()
    });
    this.sendToChan(channelName, 'message', createdMessage);
  }
    
  @SubscribeMessage('muteUser')
  async onMuteUser(socket: Socket, muteEvent: eventI) {
    // let user: string = await this.connectedUserService.getUserLogin(socket.id);
    let channel: channelI = await this.db.getChannel(muteEvent.from);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!this.db.isAdmin(socket.data.user.login, muteEvent.from)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    this.db.setMuteUser(muteEvent.from, muteEvent.to, muteEvent.eventDate, muteEvent.eventDuration)
    this.sendNotif(muteEvent.to + " a ete mute", muteEvent.from);
    this.connectedUsers.get(muteEvent.to).forEach(socketId => {
      this.server.to(socketId).emit('muted', muteEvent);
    }
  }

  @SubscribeMessage('unmuteUser') // OK
  async onUnmuteUser(socket: Socket, muteEvent: eventI) {
    let channel: channelI = await this.db.getChannel(muteEvent.from);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!this.db.isAdmin(socket.data.user.login, muteEvent.from)) {
      return socket.emit('Error', new UnauthorizedException());  
    }
    this.db.setUnmuteUser(muteEvent.from, muteEvent.to, muteEvent.eventDate, muteEvent.eventDuration);
    // avertir le mec qui a été unmute
    this.sendNotif(muteEvent.to + " a ete unmute", muteEvent.from);
    this.connectedUsers.get(muteEvent.to).forEach(socketId => {
      this.server.to(socketId).emit('unmuted', muteEvent);
    });
  }

  @SubscribeMessage('banUser')
  async onBanUser(socket: Socket, banEvent: eventI) {
    // let user: string = await this.connectedUserService.getUserLogin(socket.id);
    let channel: channelI = await this.db.getChannel(banEvent.from);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!this.db.isAdmin(socket.data.user.login, banEvent.from)) {
      return socket.emit('Error', new UnauthorizedException());  
    }
    this.db.setLeaveChannel(banEvent.to, banEvent.from);
    this.db.setBanUser(banEvent.from, banEvent.to, banEvent.eventDate, banEvent.eventDuration);
    // avertir le mec qui a été ban
    this.sendNotif(banEvent.to + " a ete ban", banEvent.from);

    this.connectedUsers.get(banEvent.to).forEach(socketId => {
      this.server.to(socketId).emit('ban', banEvent);
    });
  }

  @SubscribeMessage('unbanUser')
  async onUnbanUser(socket: Socket, banEvent: eventI) {
    // let user: string = await this.ConnectedUserService.getUserLogin(socket.id);
    let channel: channelI = await this.db.getChannel(banEvent.from);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!this.db.isAdmin(socket.data.user.login, banEvent.from)) {
      return socket.emit('Error', new UnauthorizedException());  
    }
    this.db.setUnbanUser(banEvent.from, banEvent.to);
    // avertir le mec qui a été unban
    this.sendNotif(banEvent.to + " a ete ban", banEvent.from);
  }

  @SubscribeMessage('getBlockedUsers')
  async onGetBlockedUsers(socket: Socket) {
    const blockedUsers: string[] = await this.db.getBlockedUsers(socket.data.user.login); // Juan => Peut-on utiliser cette fonction pour obtenir juste un vecteur avec des logins ?
    socket.emit('blockedUsers', blockedUsers);
  }
    
  @SubscribeMessage('blockUser')
  async onblockUser(socket: Socket, blockEvent: eventI) {
    this.db.setBlockUser(blockEvent.from, blockEvent.to);
    //this.server.to(socket.id).emit('userblocked', blockEvent);

  }
  
  @SubscribeMessage('unblockUser')
  async onUnblockUser(socket: Socket, blockEvent: eventI) {
    this.db.setUnblockUser(blockEvent.from, blockEvent.to);
    // Vaut mieux un updateUserBlocked ?
    //this.server.to(socket.id).emit('userunblocked', blockEvent);
  }

  private handleIncomingPageRequest(page: PageI) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    // add page +1 to match angular material paginator
    page.page = page.page + 1;
    return page;
  }


}
