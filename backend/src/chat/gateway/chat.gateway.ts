import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { AuthService } from 'src/auth/service/auth.service';
import { Socket, Server } from 'socket.io';
// import { UserI } from '../model/user.interface';
// import { IAccount } from '../model/user.interface';
import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { PageI } from '../model/page.interface';
// import { channelI, eventI } from '../model/channel.interface';
// import { MessageI } from '../model/message.interface';
import { PrismaService } from '../../prisma.service';
import { parse } from 'cookie';
import { hashPassword, comparePasswords } from '../utils/bcrypt';
import { AuthService } from '../../auth/auth.service';
import { IAccount, IChannel, IMessage, eventI } from '../../interfaces';
// import { IChannel, IAccount } from '../../prisma/interfaces';

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
      console.log('userId...', userId);
      if (!userId) {
        console.log('User not found');
        client.disconnect();
        return;
      }
      client.data.userId = userId;
      // client.emit('myId', userId);
    }
    catch (e) {
      console.log('Error', e);
      client.disconnect();
      return;
    }
    console.log('Client connected', {socketId: client.id, userId: client.data.userId});
    try {
      const user: IAccount = await this.db.getUserAccount(client.data.userId);
      if (user == undefined) {
        return this.disconnect(client);
      }
      client.data.user = user; // save user in client
      
      // Save connection
      console.log('saving connection');
            
      if (!this.connectedUsers.has(user.login)) {
        this.connectedUsers.set(user.login, new Set());
      }
      this.connectedUsers.get(user.login).add(client.id);
      // Only emit channels to the specific connected client
      this.onPaginatechannel(client, { page: 0, limit: 20 });
    } catch {
      console.log('Error', 'connection failed');
      return this.disconnect(client);
    }
    console.log('connection achieved');
  }

  async handleDisconnect(socket: Socket) {
    // remove connection
    if (socket.data.user == undefined) {
      socket.disconnect();
      return;
    }
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
      if (channel.channelName.includes(key)) {
        res.push(channel.channelName);
      }
    }
    return this.server.to(socket.id).emit('publicChannels', channels);
  }
  
  @SubscribeMessage('createChannel')
  async onCreatechannel(socket: Socket, channel: IChannel) {
    let login: string = socket.data.user.login;
    let userId: string = socket.data.userId;

    console.log('Creating', channel.channelName);
    if ((await this.db.getChannelInfo(channel.channelName)) !== null) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (channel.is_pwd) {
      channel.password = hashPassword(channel.password);
    }
    await this.db.createchannel(channel, userId);
    for (const user of channel.users) {
      console.log('Joining', user);
      if (!(await this.db.isUser(user.login))){
        console.log(user, " not found");
        continue;
      } 
      
      this.db.setJoinChannel(user.login, channel.channelName);
      const socketIds: Set<string> = this.connectedUsers.get(user.login);
      if (socketIds) {
        const channels = await this.db.getChannelsForUser(user.login, 1, 10);
        // // substract page -1 to match the angular material paginator
        // channels.meta.currentPage = channels.meta.currentPage - 1;
        console.log('Channels to', user.login, channels);
        for (const socketId of socketIds.values()) {
          this.server.to(socketId).emit('channels', channels);
        }
      }
      else {
        console.log(user, ' not connected');
      }
    }
    //await this.db.setMakeAdmin(userId, channel.channelName);
    await this.db.setMakeAdmin(login, channel.channelName);
  }

  @SubscribeMessage('getMyChannels')
  async onPaginatechannel(socket: Socket, page: PageI) {
    const channels = await this.db.getChannelsForUser(socket.data.user.login, this.handleIncomingPageRequest(page).page, this.handleIncomingPageRequest(page).limit);
    // // substract page -1 to match the angular material paginator
    // channels.meta.currentPage = channels.meta.currentPage - 1;
    console.log('Channels to', socket.data.user.login, channels);
    return this.server.to(socket.id).emit('channels', channels);
  }

  @SubscribeMessage('joinChannel')
  async onJoinchannel(socket: Socket, channelInfo: {name: string, password: string}) {
    const channel: IChannel= await this.db.getChannelInfo(channelInfo.name);
    const login = socket.data.user.login;

    if (!channel || channel.isPrivate) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (channel.users.find(user => user.login === login) !== undefined) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (channel.bannedUsers.find(user => user.login === login))
    {
      let mute : eventI = await this.db.getBanInfo(channel.channelName, login);
      if (mute.eventDate.getDate() + mute.eventDuration > Date.now())
      {
        this.db.deleteBan(channel.channelName, login);
      }
      else
        return socket.emit('Error', new UnauthorizedException());      
    }
    console.log('Joining channel', channelInfo.name, channel.is_pwd);
    if (channel.is_pwd && comparePasswords(channelInfo.password, channel.password)) {
      return this.server.to(socket.id).emit('wrongPassword', new UnauthorizedException());
    }
    // if (!(await this.db.isUser(login))){
    //   return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    // }

    await this.db.setJoinChannel(login, channel.channelName);
    this.sendNotif(login + " joined the channel", channel.channelName, socket.data.userId);
    this.onPaginatechannel(socket, { page: 1, limit: 20 });
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
    await this.db.leaveChannel(socket.data.user.login, channelName);
    this.onPaginatechannel(socket, { page: 0, limit: 20 });
  }

  @SubscribeMessage('addMember')
  async onAddMember(socket: Socket, addMemberInfo: {channelName: string, login: string}) { // Pb avec l'ID ?
    let channel: IChannel= await this.db.getChannelInfo(addMemberInfo.channelName);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!channel.admins.includes(socket.data.userId)) { //Est-ce qu'il faut que je mette dans des boucles tous les includes ?
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    for (const user of channel.users) { // OK Augustin ?
      if (user.login.includes(addMemberInfo.login)) {
        return this.server.to(socket.id).emit('Error', new UnauthorizedException());
      }
    }
    // if (channel.users.includes(id)) {
    //   return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    // }
    if (!(await this.db.isUser(addMemberInfo.login))){
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    this.db.setJoinChannel(addMemberInfo.login, addMemberInfo.channelName);
    // channel = await this.db.getChannelInfo(channelName);
    // this.sendToChan(channelName, 'channelInfo', channel);
  }


  // @SubscribeMessage('addMember')
  // async onAddMember(socket: Socket, channelName: string, id: string) { // Pb avec l'ID ?
  //   let channel: IChannel= await this.db.getChannelInfo(channelName);
  //   if (!channel) {
  //     return this.server.to(socket.id).emit('Error', new UnauthorizedException());
  //   }
  //   if (!channel.admins.includes(socket.data.userId)) {
  //     return this.server.to(socket.id).emit('Error', new UnauthorizedException());
  //   }
  //   for (const user of channel.users) { // OK Augustin ?
  //     if (user.id.includes(id)) {
  //       return this.server.to(socket.id).emit('Error', new UnauthorizedException());
  //     }
  //   }
  //   // if (channel.users.includes(id)) {
  //   //   return this.server.to(socket.id).emit('Error', new UnauthorizedException());
  //   // }
  //   this.db.setJoinChannel(id, channelName);
  //   // channel = await this.db.getChannelInfo(channelName);
  //   // this.sendToChan(channelName, 'channelInfo', channel);
  // }

  @SubscribeMessage('promoteToAdmin') // muteEvent
  async onPromoteToAdmin(socket: Socket, promoteInfo: {channelName: string, login: string}) {
    let channel: IChannel = await this.db.getChannelInfo(promoteInfo.channelName);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!channel.users.map(user => user.login).includes(promoteInfo.login)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!channel.admins.map(user => user.login).includes(socket.data.user.login)
        || channel.admins.map(user => user.login).includes(promoteInfo.login)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    this.db.setMakeAdmin(promoteInfo.login, promoteInfo.channelName);
    this.db.deleteMuteUser(promoteInfo.login, promoteInfo.channelName);
    this.sendNotif(promoteInfo.login + " is now an admin", promoteInfo.channelName, socket.data.userId);
  }

  @SubscribeMessage('getChannelInfo')
  async onGetChannelInfo(socket: Socket, channelName: string) {
    const channel: IChannel= await this.db.getChannelInfo(channelName);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (channel.users.find(user => user.login === socket.data.user.login) === undefined) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    // si le user en questiona fini sa peine de mute, on le unmute
    if (channel.mutedUsers.map(user => user.login).includes(socket.data.user.login))
    {
      let mute : eventI = await this.db.getMuteInfo(channel.channelName, socket.data.user.login);
      if (mute.eventDate.getTime() + mute.eventDuration > Date.now()) {
        this.db.deleteMuteUser(channel.channelName, socket.data.user.login);
      }
      else
        return socket.emit('Error', new UnauthorizedException());      
    }
    socket.emit('channelInfo', channel);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: IMessage) {
    message.from = socket.data.user.login;
    const channel: IChannel= await this.db.getChannelInfo(message.channelId);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!(channel.users.map(user => user.login).includes(socket.data.user.login))
      || channel.mutedUsers.map(user => user.login).includes(socket.data.user.login)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    this.db.setChannelMessage(socket.data.userId, channel.channelName, message.message); 
    this.sendToChan(message.channelId, 'message', message);
  }

  async sendTo(login: string, command: string, data: any) {
    const socketids: Set<string> = this.connectedUsers.get(login);
    if (socketids) {
      for (const socketId of socketids.values()) {
        this.server.to(socketId).emit(command, data);
      }
    }
  }
  async sendToChan(channelName: string, command: string, data: any) {
    const users = await this.db.getChannelUsers(channelName);
    for (const user of users) {
      this.sendTo(user.login, command, data);
    }
  }

  sendNotif(text: string, channelName: string, userId: string) {
    const createdMessage: IMessage = {
      isNotif: true,
      message: text,
      from: userId,
      channelId: channelName,
      createdAt: new Date()
    };
    this.db.setChannelMessage(userId, channelName, text); // attention channel name
    this.sendToChan(channelName, 'message', createdMessage);
  }

  @SubscribeMessage('muteUser')
  async onMuteUser(socket: Socket, muteEvent: eventI) {
    // let user: string = await this.connectedUserService.getUserLogin(socket.id);
    console.log(muteEvent);
    let channel: IChannel= await this.db.getChannelInfo(muteEvent.from);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!channel.admins.map(user => user.login).includes(socket.data.user.login)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    console.log(muteEvent);
    this.db.setMuteUser(muteEvent.from, muteEvent.to, muteEvent.eventDuration);
    this.sendNotif(muteEvent.to + " got muted", muteEvent.from, socket.data.userId);
    this.sendTo(muteEvent.to, 'muted', muteEvent);
  }

  @SubscribeMessage('unmuteUser') // OK
  async onUnmuteUser(socket: Socket, muteEvent: eventI) {
    let channel: IChannel= await this.db.getChannelInfo(muteEvent.from);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!channel.admins.map(user => user.login).includes(socket.data.user.login)) {
      return socket.emit('Error', new UnauthorizedException());  
    }
    this.db.deleteMuteUser(muteEvent.from, muteEvent.to);
    // avertir le mec qui a été unmute
    this.sendNotif(muteEvent.to + " a ete unmute", muteEvent.from, socket.data.userId);
    this.sendTo(muteEvent.to, 'unmuted', muteEvent);
  }

  @SubscribeMessage('banUser')
  async onBanUser(socket: Socket, banEvent: eventI) {
    // let user: string = await this.connectedUserService.getUserLogin(socket.id);
    let channel: IChannel= await this.db.getChannelInfo(banEvent.from);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!channel.admins.map(user => user.login).includes(socket.data.user.login)) {
      return socket.emit('Error', new UnauthorizedException());  
    }
    this.db.leaveChannel(banEvent.to, banEvent.from);
    this.db.setBanUser(banEvent.from, banEvent.to, banEvent.eventDuration);
    // avertir le mec qui a été ban
    this.sendNotif(banEvent.to + " got banned", banEvent.from, socket.data.userId);
    this.sendTo(banEvent.to, 'ban', banEvent);

  }

  @SubscribeMessage('unbanUser')
  async onUnbanUser(socket: Socket, banEvent: eventI) {
    // let user: string = await this.ConnectedUserService.getUserLogin(socket.id);
    let channel: IChannel= await this.db.getChannelInfo(banEvent.from);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!channel.admins.map(user => user.login).includes(socket.data.user.login)) {
      return socket.emit('Error', new UnauthorizedException());  
    }
    this.db.deleteBan(banEvent.to, banEvent.from);
    // avertir le mec qui a été unban
    this.sendNotif(banEvent.to + " got unbanned", banEvent.from, socket.data.userId);
  }

  @SubscribeMessage('getBlockedUsers')
  async onGetBlockedUsers(socket: Socket) {
    const blockedUsers: IAccount[] = await this.db.getBlockedUsers(socket.data.user.login); // Juan => Peut-on utiliser cette fonction pour obtenir juste un vecteur avec des logins ?
    socket.emit('blockedUsers', blockedUsers);
  }
    
  @SubscribeMessage('blockUser')
  async onblockUser(socket: Socket, blockEvent: eventI) {
    // this.db.setBlockUser(blockEvent.from, blockEvent.to);
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
