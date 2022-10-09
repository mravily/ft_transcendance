import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { AuthService } from 'src/auth/service/auth.service';
import { Socket, Server } from 'socket.io';
import { IAccount, UserI } from '../model/user.interface';
import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { PageI } from '../model/page.interface';
import { channelI, eventI } from '../model/channel.interface';
import { MessageI } from '../model/message.interface';
import { PrismaService } from '../../prisma.service';
import { parse } from 'cookie';
import { hashPassword, comparePasswords } from '../utils/bcrypt';
import { AuthService } from '../../auth/auth.service';
import { IChannel } from '../../prisma/interfaces';

// Checker que l'on va chercher les created_at dans la base de donnée ;

@WebSocketGateway({ namespace: '/chat',
             cors: { origin: [ 'localhost:4200']  }})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {

  @WebSocketServer()
  server: Server;

  connectedUsers: Map<string, Set<string>> = new Map();

  constructor(
        private authService: AuthService,
        private db: PrismaService) { }

  async onModuleInit() {
    console.log('ChatGateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const cookie = parse(client.handshake.headers.cookie);
      const token = cookie['token'];
      if (!token) {
        console.log('token not found');
        client.disconnect();
        return;
      }
      const userId = await this.authService.getUseridFromToken(token);
      if (!userId) {
        console.log('User not found');
        client.disconnect();
        return;
      }
      client.data.userId = userId;
      client.emit('myId', userId);
    }
    catch (e) {
      console.log('Error', e);
      client.disconnect();
    }
    console.log('Client connected', client.id, client.data);
    try {
      // const decodedToken = await this.authService.verifyJwt(socket.handshake.headers.authorization);
      const user: UserI = await this.db.getUserById(client.data.userId);
      if (!user) {
        return this.disconnect(client);
      } else {
        client.data.user = user; // save user in client
        console.log('User', user);
        // Save connection
        if (!this.connectedUsers.has(user.login)) {
          this.connectedUsers.set(user.login, new Set());
        }
        this.connectedUsers.get(user.login).add(client.id);
        // Only emit channels to the specific connected client
        this.onPaginatechannel(client, { page: 0, limit: 20 });
      }
    } catch {
      return this.disconnect(client);
    }
  }

  async handleDisconnect(socket: Socket) {
    // remove connection
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

  @SubscribeMessage('getPublicChannels')
  async onGetPublicchannels(socket: Socket, page) {
    const channels = await this.db.getPublicChannels();
    return this.server.to(socket.id).emit('publicChannels', channels);
  }

  @SubscribeMessage('searchPublicChannels')
  async onSearchPublicchannels(socket: Socket, key: string) {
    const channels: IChannel[]  = await this.db.getPublicChannels();
    let res: string[] = [];
    for (const channel of channels) {
      if (channel.channelName.includes(key)) { // OK Augustin ?
        res.push(channel.channelName);         // OK Augustin ?
      }
    }
    return this.server.to(socket.id).emit('publicChannels', channels);
  }
  
  @SubscribeMessage('createChannel')
  async onCreatechannel(socket: Socket, channel: IChannel) {
    let login: string = socket.data.user.login;
    let userId: string = socket.data.userId;
    if ((await this.db.getChannelInfo(channel.channelName)) !== null) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }

    if (channel.is_pwd) {
      channel.password = hashPassword(channel.password);
    }
    await this.db.setChannel(channel, userId);
    for (const user of channel.users) {
      const curUser = await this.db.getUser(user);
      if (!curUser)
      {
        console.log(user, " not found");
        continue;
      }

      this.db.setJoinChannel(curUser.id, channel.channelName);
      const socketIds: Set<string> = this.connectedUsers.get(user.login);
      if (socketIds) {
        const channels = await this.db.getChannelsForUser(curUser.id, 1, 10);
        // // substract page -1 to match the angular material paginator
        // channels.meta.currentPage = channels.meta.currentPage - 1;
        console.log('Channels to', user, channels);
        for (const socketId of socketIds.values()) {
          this.server.to(socketId).emit('channels', channels);
        }
      }
      else
      {
        console.log(user, ' not connected');
      }
    }
    //await this.db.setMakeAdmin(userId, channel.channelName);
    await this.db.setMakeAdmin(socket.data.user.login, channel.channelName);
  }

  @SubscribeMessage('getMyChannels')
  async onPaginatechannel(socket: Socket, page: PageI) {
    const channels = await this.db.getChannelsForUser(socket.data.userId, this.handleIncomingPageRequest(page).page, this.handleIncomingPageRequest(page).limit);
    // // substract page -1 to match the angular material paginator
    // channels.meta.currentPage = channels.meta.currentPage - 1;
    return this.server.to(socket.id).emit('channels', channels);
  }

  @SubscribeMessage('joinChannel')
  async onJoinchannel(socket: Socket, channelInfo: {name: string, password: string}) {
    const channel: IChannel= await this.db.getChannelInfo(channelInfo.name);
    if (!channel || channel.isPrivate) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (channel.users.includes(socket.data.userId)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (channel.bannedUsers.includes(socket.data.userId))
    {
      let mute : eventI = await this.db.getBanInfo(channel.channelName, socket.data.user.login);
      if (mute.eventDate.getDate() + mute.eventDuration > Date.now())
      {
        this.db.deleteBan(channel.channelName, socket.data.user.login);
      }
      else
        return socket.emit('Error', new UnauthorizedException());      
    }
    console.log('Joining channel', channelInfo.name, channel.is_pwd);
    if (channel.is_pwd && comparePasswords(channelInfo.password, channel.password)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    await this.db.setJoinChannel(socket.data.userId, channel.channelName);
    this.sendNotif(socket.data.user.login + " joined the channel", channel.channelName, socket.data.userId);
    this.onPaginatechannel(socket, { page: 0, limit: 20 });
    // const messages = await this.db.getMessagesForChannel(channel.channelName, 1, 10); //
    // // messages.meta.currentPage = messages.meta.currentPage - 1;
    // await this.server.to(socket.id).emit('messages', messages);
    let users = await this.db.getChannelUsers(channel.channelName);
    this.sendToChan(channel.channelName, 'channelMembers', users);
  }
  
  @SubscribeMessage('updatePassword')
  async onUpdatePassword(socket: Socket, channelInfo: {name: string, password?: string}) {
    // utilisateur autorisé ?
    const channel: IChannel= await this.db.getChannelInfo(channelInfo.name);
    if (!channel || !this.db.isCreator(channelInfo.name, socket.data.user.login))
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    if ("password" in channelInfo) {
      channel.password = hashPassword(channelInfo.password);
      this.db.setChannelPass(channel.channelName, channel.password);
    }
    else {
      this.db.removeChannelPass(channel.channelName);
    }
  }


  @SubscribeMessage('leaveChannel')
  async onLeavechannel(socket: Socket, channelName: string) {
    const channel: IChannel= await this.db.getChannelInfo(channelName);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!channel.users.includes(socket.data.userId))
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    this.sendNotif(socket.data.user.login + " left the channel", channelName, socket.data.userId);
    await this.db.leaveChannel(socket.data.userId, channelName);
    this.onPaginatechannel(socket, { page: 0, limit: 20 });
  }

  @SubscribeMessage('addMember')
  async onAddMember(socket: Socket, channelName: string, id: string) { // Pb avec l'ID ?
    let channel: IChannel= await this.db.getChannelInfo(channelName);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!channel.admins.includes(socket.data.userId)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    for (const user of channel.users) { // OK Augustin ?
      if (user.id.includes(id)) {
        return this.server.to(socket.id).emit('Error', new UnauthorizedException());
      }
    }
    // if (channel.users.includes(id)) {
    //   return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    // }
    this.db.setJoinChannel(id, channelName);
    // channel = await this.db.getChannelInfo(channelName);
    // this.sendToChan(channelName, 'channelInfo', channel);
  }

  @SubscribeMessage('promoteToAdmin') // muteEvent
  async onPromoteToAdmin(socket: Socket, promoteInfo: {channelName: string, login: string}) {
    let channel: IChannel= await this.db.getChannelInfo(promoteInfo.channelName);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!this.db.isAdmin(socket.data.user.login, promoteInfo.channelName)
        || this.db.isAdmin(promoteInfo.login, promoteInfo.channelName)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    this.db.setMakeAdmin(promoteInfo.login, promoteInfo.channelName);
    this.sendNotif(promoteInfo.login + " is now an admin", promoteInfo.channelName, socket.data.userId);
  }

  @SubscribeMessage('getChannelInfo')
  async onGetChannelInfo(socket: Socket, channelName: string) {
    const channel: IChannel= await this.db.getChannelInfo(channelName);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!(channel.users.includes(socket.data.userId))) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    socket.emit('channelInfo', channel);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: MessageI) {
    message.user = socket.data.user.login;
    const channel: IChannel= await this.db.getChannelInfo(message.channel);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!(channel.users.includes(socket.data.userId))) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (socket.data.user.login in channel.mutedUsers)
    {
      let mute : eventI = await this.db.getMuteInfo(channel.channelName, socket.data.user.login);
      if (mute.eventDate.getDate() + mute.eventDuration > Date.now())
      {
        this.db.deleteMuteUser(channel.channelName, socket.data.user.login);
      }
      else
        return socket.emit('Error', new UnauthorizedException());      
    }
    this.db.setChannelMessage(socket.data.userId, channel.channelName, message.text); 
    this.sendToChan(message.channel, 'message', message);
  }

  async sendToChan(channelName: string, command: string, data: any) {
    const users = await this.db.getChannelUsers(channelName);
    for (const user of users) {
      const socketids: Set<string> = this.connectedUsers.get(user.login);
      if (socketids) {
        for (const socketId of socketids.values()) {
          this.server.to(socketId).emit(command, data);
        }
      }
    }
  }

  sendNotif(text: string, channelName: string, userId: string) {
    const createdMessage: MessageI = {
      isNotif: true,
      text: text,
      user: userId,
      channel: channelName,
      createdAt: new Date()
    };
    this.db.setChannelMessage(userId, channelName, text); // attention channel name
    this.sendToChan(channelName, 'message', createdMessage);
  }
    
  @SubscribeMessage('muteUser')
  async onMuteUser(socket: Socket, muteEvent: eventI) {
    // let user: string = await this.connectedUserService.getUserLogin(socket.id);
    let channel: IChannel= await this.db.getChannelInfo(muteEvent.from);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!this.db.isAdmin(socket.data.userId, muteEvent.from)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    this.db.setMuteUser(muteEvent.from, muteEvent.to, muteEvent.eventDuration);
    this.sendNotif(muteEvent.to + " a ete mute", muteEvent.from, socket.data.userId);
    this.connectedUsers.get(muteEvent.to).forEach(socketId => {
      this.server.to(socketId).emit('muted', muteEvent);
    });
  }

  @SubscribeMessage('unmuteUser') // OK
  async onUnmuteUser(socket: Socket, muteEvent: eventI) {
    let channel: IChannel= await this.db.getChannelInfo(muteEvent.from);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!this.db.isAdmin(socket.data.user.login, muteEvent.from)) {
      return socket.emit('Error', new UnauthorizedException());  
    }
    this.db.deleteMuteUser(muteEvent.from, muteEvent.to);
    // avertir le mec qui a été unmute
    this.sendNotif(muteEvent.to + " a ete unmute", muteEvent.from, socket.data.userId);
    this.connectedUsers.get(muteEvent.to).forEach(socketId => {
      this.server.to(socketId).emit('unmuted', muteEvent);
    });
  }

  @SubscribeMessage('banUser')
  async onBanUser(socket: Socket, banEvent: eventI) {
    // let user: string = await this.connectedUserService.getUserLogin(socket.id);
    let channel: IChannel= await this.db.getChannelInfo(banEvent.from);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!this.db.isAdmin(socket.data.user.login, banEvent.from)) {
      return socket.emit('Error', new UnauthorizedException());  
    }
    this.db.leaveChannel(banEvent.to, banEvent.from);
    this.db.setBanUser(banEvent.from, banEvent.to, banEvent.eventDuration);
    // avertir le mec qui a été ban
    this.sendNotif(banEvent.to + " a ete ban", banEvent.from, socket.data.userId);

    this.connectedUsers.get(banEvent.to).forEach(socketId => {
      this.server.to(socketId).emit('ban', banEvent);
    });
  }

  @SubscribeMessage('unbanUser')
  async onUnbanUser(socket: Socket, banEvent: eventI) {
    // let user: string = await this.ConnectedUserService.getUserLogin(socket.id);
    let channel: IChannel= await this.db.getChannelInfo(banEvent.from);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!this.db.isAdmin(socket.data.user.login, banEvent.from)) {
      return socket.emit('Error', new UnauthorizedException());  
    }
    this.db.deleteBan(banEvent.to, banEvent.from);
    // avertir le mec qui a été unban
    this.sendNotif(banEvent.to + " a ete ban", banEvent.from, socket.data.userId);
  }

  @SubscribeMessage('getBlockedUsers')
  async onGetBlockedUsers(socket: Socket) {
    const blockedUsers: IAccount[] = await this.db.getBlockedUsers(socket.data.user.login); // Juan => Peut-on utiliser cette fonction pour obtenir juste un vecteur avec des logins ?
    socket.emit('blockedUsers', blockedUsers);
  }
    
  @SubscribeMessage('blockUser')
  async onblockUser(socket: Socket, blockEvent: eventI) {
    this.db.setBlockUser(blockEvent.from, blockEvent.to);
    //this.server.to(socket.id).emit('userblocked', blockEvent);

  }
  
  @SubscribeMessage('unblockUser')
  async onUnblockUser(socket: Socket, blockEvent: eventI) {
    this.db.deleteBlockUser(blockEvent.from, blockEvent.to);
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
