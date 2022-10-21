import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { AuthService } from 'src/auth/service/auth.service';
import { Socket, Server } from 'socket.io';
import { forwardRef, Global, Inject, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { PageI } from '../model/page.interface';
import { PrismaService } from '../../../prisma.service';
import { parse } from 'cookie';
import { hashPassword, comparePasswords } from '../utils/bcrypt';
import { AuthService } from '../../../auth/auth.service';
import { IAccount, IChannel, IMessage, eventI } from '../../../interfaces';
import { GameService } from '../../game/game.service';

// Checker que l'on va chercher les created_at dans la base de donnée ;

/*

*/ 

let DMPREFIX = '##DM##';

@WebSocketGateway({ namespace: '/chat',
             cors: { origin: [ 'localhost:4200']  }})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {

  @WebSocketServer()
  server: Server;

  connectedUsers: Map<string, Set<string>> = new Map();

  constructor(
        private authService: AuthService,
        @Inject(forwardRef(() => GameService)) private gameServ: GameService,
        private db: PrismaService) { }

  async onModuleInit() {
    //console.log('ChatGateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const cookie = parse(client.handshake.headers.cookie);
      const token = cookie['access'];
      if (!token) {
        //console.log('token not found');
        client.disconnect();
        return;
      }
      const userId = await this.authService.getUseridFromToken(token);
      // console.log('userId...', userId);
      if (!userId) {
        //console.log('User not found');
        client.disconnect();
        return;
      }
      client.data.userId = userId;
    }
    catch (e) {
      //console.log('Error', e);
      client.disconnect();
      return;
    }
    try {
      const user: IAccount = await this.db.getUserAccount(client.data.userId);
      if (user.login == undefined) {
        //console.log('User', user);
        return this.disconnect(client);
      }
      client.data.user = user; // save user in client
      client.emit('myUser', user);
      // Save connection
      if (!this.connectedUsers.has(user.login)) {
        this.connectedUsers.set(user.login, new Set());
      }
      this.connectedUsers.get(user.login).add(client.id);

      //console.log('Connected users', this.connectedUsers);
      // Only emit channels to the specific connected client
      this.onPaginatechannel(client, { page: 0, limit: 200 });
    } catch {
      //console.log('Error', 'connection failed');
      return this.disconnect(client);
    }
    //console.log('Client connected to chat', {login: client.data.user.login, socketId: client.id, userId: client.data.userId});
  }
  // dan sle front faire un isready pour empecher de renvoyer

  async handleDisconnect(socket: Socket) {
    // remove connection
    if (socket.data.user == undefined) {
      // socket.disconnect();
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
    if (socket.data?.user == undefined)
      return;
    const channels = await this.db.getPublicChannels();
    return this.server.to(socket.id).emit('publicChannels', channels);
  }

  @SubscribeMessage('searchPublicChannels')
  async onSearchPublicchannels(socket: Socket, key: string) { 
    if (socket.data?.user == undefined)
      return;
    const channels: IChannel[]  = await this.db.searchPublicChannels(key);
    return this.server.to(socket.id).emit('publicChannels', channels);
  }

  @SubscribeMessage('searchUsers')
  async onSearchUser(socket: Socket, key: string) {
    if (socket.data?.user == undefined)
      return;
    const res: IAccount[] = await this.db.searchUser(key);
    socket.emit('users', res);
  }
  
  @SubscribeMessage('createChannel')
  async onCreatechannel(socket: Socket, channel: IChannel) {
    if (socket.data?.user == undefined)
      return;
    let login: string = socket.data.user.login;
    let userId: string = socket.data.userId;

    //console.log('Creating', channel.channelName);
    if ((await this.db.getChannelInfo(channel.channelName)) !== null || channel.channelName.startsWith(DMPREFIX)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    await this.db.createchannel(channel, userId);
    await this.db.setJoinChannel(login, channel.channelName);
    
    let members: string[] = [login];
    for (const user of channel.users) {
      //console.log('Joining', user);
      if (user.login == null || !(await this.db.isUser(user.login)))  {
        //console.log(user, " not found");
        continue;
      }
      if (members.includes(user.login)) {
        //console.log(user, " already in channel");
        continue;
      }
      await this.db.setJoinChannel(user.login, channel.channelName);
      members.push(user.login);
    }
    for (const member of members) {
      this.updateChannels(member);
    }
    await this.db.setMakeAdmin(login, channel.channelName);
    if (channel.is_pwd) {
      channel.password = hashPassword(channel.password);
      this.db.setChannelPass(channel.channelName, channel.password);
    }
    this.sendNotif(login + ' created channel ' + channel.channelName, channel.channelName, userId);
    this.onGetChannelInfo(socket, channel.channelName);
  }
  
  async updateChannels(login: string) {
    const socketIds: Set<string> = this.connectedUsers.get(login);
    if (socketIds) {
      const channels = await this.db.getChannelsForUser(login, 0, 200);
      for (const socketId of socketIds.values()) {
        this.server.to(socketId).emit('channels', channels);
      }
    }
  }
    
  @SubscribeMessage('getMyChannels')
  async onPaginatechannel(socket: Socket, page: PageI) {
    if (socket.data?.user == undefined)
      return;
    const channels = await this.db.getChannelsForUser(socket.data.user.login, 0, 200);
    return this.server.to(socket.id).emit('channels', channels);
  }

  @SubscribeMessage('joinChannel')
  async onJoinchannel(socket: Socket, channelInfo: {name: string, password: string}) {
    if (socket.data?.user == undefined)
      return;
    let channel: IChannel= await this.db.getChannelInfo(channelInfo.name);
    const login = socket.data.user.login;

    if (!channel || channel.isPrivate) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (channel.users.find(user => user.login === login) !== undefined) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    // si le user en questiona fini sa peine de ban, on le unban, pour l'instant on test les peines permanates
    if (channel.bannedUsers.find(user => user.login === login))
    {
      let mute : eventI = await this.db.getBanInfo(channel.channelName, login);
      mute.eventDuration = 10000;
      if (mute.eventDate.getTime() + mute.eventDuration < Date.now())
      {
        await this.db.deleteBan(channel.channelName, login);
      }
      else
        return socket.emit('Error', new UnauthorizedException());      
    }
    if (channel.is_pwd && !comparePasswords(channelInfo.password, channel.password)) {
      return this.server.to(socket.id).emit('wrongPassword', new UnauthorizedException());
    }
    // if (!(await this.db.isUser(login))){
    //   return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    // }
    await this.db.setJoinChannel(login, channel.channelName);
    this.sendNotif(login + " joined the channel", channel.channelName, socket.data.userId);
    this.onPaginatechannel(socket, { page: 0, limit: 200 });
    channel = await this.db.getChannelInfo(channelInfo.name);
    this.sendToChan(channelInfo.name, 'channelUpdate', channel);
    this.onGetChannelInfo(socket, channelInfo.name);
  }
  
  @SubscribeMessage('updatePassword')
  async onUpdatePassword(socket: Socket, channelInfo: {name: string, password?: string}) {
    if (socket.data?.user == undefined)
      return;
    let channel: IChannel= await this.db.getChannelInfo(channelInfo.name);
    //console.log('Updating password', channelInfo.name, channel.is_pwd, "creator", channel.creator, "user", socket.data.user.login);
    if (!channel || socket.data.user.login != channel.creator)
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    if ("password" in channelInfo) {
      channel.password = hashPassword(channelInfo.password);
      await this.db.setChannelPass(channel.channelName, channel.password);
    }
    else
      await this.db.removeChannelPass(channel.channelName);
    channel = await this.db.getChannelInfo(channelInfo.name);
    this.sendToChan(channelInfo.name, 'channelUpdate', channel);

  }

  @SubscribeMessage('leaveChannel')
  async onLeavechannel(socket: Socket, channelName: string) {
    if (socket.data?.user == undefined)
      return;
    let channel: IChannel= await this.db.getChannelInfo(channelName);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!channel.users.map(user => user.login).includes(socket.data.user.login))
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    // si c'est le dernier user du channel, on supprime le channel
    // sinon, si ct le creator, on en designe un admin // ou alors on supprime le channel comme tu veux
    //  et si il n'y pas d'autre admin, on en designe un // TODO Ulysse aussi probleme de motdepasse, a investiguer
    this.sendNotif(socket.data.user.login + " left the channel", channelName, socket.data.userId);
    await this.db.leaveChannel(socket.data.user.login, channelName);
    this.onPaginatechannel(socket, { page: 0, limit: 200 });
    channel = await this.db.getChannelInfo(channelName);
    this.sendToChan(channelName, 'channelUpdate', channel);
    if (socket.data.user.login == channel.creator || channel.users.map(user => user.login).length == 0){
      this.db.deleteChannel(channelName);
    }
  }

  @SubscribeMessage('addMember')
  async onAddMember(socket: Socket, addMemberInfo: {channelName: string, login: string}) {
    if (socket.data?.user == undefined)
      return;
    let channel: IChannel= await this.db.getChannelInfo(addMemberInfo.channelName);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    // if (!channel.admins.map(user => user.login).includes(socket.data.user.login)) { //Est-ce qu'il faut que je mette dans des boucles tous les includes ? NON les map c'est swag
    //   return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    // }
    if (channel.users.map(user => user.login).includes(addMemberInfo.login)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (channel.bannedUsers.map(user => user.login).includes(addMemberInfo.login)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (addMemberInfo.login == null || !(await this.db.isUser(addMemberInfo.login))) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    await this.db.setJoinChannel(addMemberInfo.login, addMemberInfo.channelName);
    this.updateChannels(addMemberInfo.login);
    this.sendNotif(socket.data.user.login + " added " + addMemberInfo.login + " to the channel", addMemberInfo.channelName, socket.data.userId);
    channel = await this.db.getChannelInfo(addMemberInfo.channelName);
    this.sendToChan(addMemberInfo.channelName, 'channelUpdate', channel);
  }

  @SubscribeMessage('removeMember')
  async onRemoveMember(socket: Socket, delMemberInfo: {channelName: string, login: string}) {
    if (socket.data?.user == undefined)
      return;
    let channel: IChannel= await this.db.getChannelInfo(delMemberInfo.channelName);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!channel.admins.map(user => user.login).includes(socket.data.user.login)
        || channel.admins.map(user => user.login).includes(delMemberInfo.login)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!channel.users.map(user => user.login).includes(delMemberInfo.login)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (channel.creator == delMemberInfo.login) {
      return socket.emit('Error', new UnauthorizedException()); 
    }
    this.sendNotif(socket.data.user.login + " removed " + delMemberInfo.login + " from the channel", delMemberInfo.channelName, socket.data.userId);
    await this.db.leaveChannel(delMemberInfo.login, delMemberInfo.channelName);
    channel = await this.db.getChannelInfo(delMemberInfo.channelName);
    this.sendToChan(delMemberInfo.channelName, 'channelUpdate', channel);
    this.updateChannels(delMemberInfo.login);
  }

  @SubscribeMessage('promoteToAdmin')
  async onPromoteToAdmin(socket: Socket, promoteInfo: {channelName: string, login: string}) {
    if (socket.data?.user == undefined)
      return;
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
    await this.db.setMakeAdmin(promoteInfo.login, promoteInfo.channelName);
    await this.db.deleteMuteUser(promoteInfo.login, promoteInfo.channelName); // a proteger
    this.sendNotif(promoteInfo.login + " is now an admin", promoteInfo.channelName, socket.data.userId);
    channel = await this.db.getChannelInfo(promoteInfo.channelName);
    this.sendToChan(promoteInfo.channelName, 'channelUpdate', channel);
  }

  @SubscribeMessage('getDMinfo')
  async onGetDMinfo(socket: Socket, login: string) {
    if (socket.data?.user == undefined)
      return;
    let roomName = DMPREFIX+[socket.data.user.login, login].sort().join("-");
    let res: IChannel = await this.db.getChannelInfo(roomName);

    if (res == null) {
      if (!(await this.db.isUser(login))) {
        return this.server.to(socket.id).emit('Error', new UnauthorizedException());
      }
      let channel : IChannel = {
        channelName: roomName,
        isDirect: true, isPrivate: true,
      };
      await this.db.createchannel(channel, socket.data.userId);
      await this.db.setJoinChannel(socket.data.user.login, roomName);
      await this.db.setJoinChannel(login, roomName);
      res = await this.db.getChannelInfo(roomName);
      this.sendNotif(socket.data.user.login + ' started direct messages', roomName, socket.data.userId);
      this.onPaginatechannel(socket, { page: 0, limit: 200 });
    }
    socket.emit('channelInfo', res);
    this.onGetMessages(socket, roomName);
  }

  @SubscribeMessage('getChannelInfo')
  async onGetChannelInfo(socket: Socket, channelName: string) {
    if (socket.data?.user == undefined)
      return;
    let channel: IChannel= await this.db.getChannelInfo(channelName);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (channel.users.find(user => user.login === socket.data.user.login) === undefined) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    // si le user en questiona fini sa peine de mute, on le unmute, pour l'instant on test les peines permanates
    if (channel.mutedUsers.map(user => user.login).includes(socket.data.user.login))
    {
      let mute : eventI = await this.db.getMuteInfo(channel.channelName, socket.data.user.login);
      mute.eventDuration = 10000;
      if (mute.eventDate.getTime() + mute.eventDuration < Date.now()) { // a reverifier
        await this.db.deleteMuteUser(channel.channelName, socket.data.user.login);
        channel = await this.db.getChannelInfo(channelName);
        this.sendToChan(channelName, 'channelUpdate', channel);    
      }
      else
        return socket.emit('Error', new UnauthorizedException());      
    }
    socket.emit('channelInfo', channel);
  }

  @SubscribeMessage('getMessages')
  async onGetMessages(socket: Socket, channelName: string) {
    if (socket.data?.user == undefined)
      return;
    let channel: IChannel= await this.db.getChannelInfo(channelName);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (channel.users.find(user => user.login === socket.data.user.login) === undefined) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    let messages: IMessage[] = await this.db.getChannelMessages(channelName);
    socket.emit('messages', messages);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: IMessage) {
    if (socket.data?.user == undefined)
      return;
    message.from = socket.data.user.login;
    const channel: IChannel= await this.db.getChannelInfo(message.channelId);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!(channel.users.map(user => user.login).includes(socket.data.user.login))
      || channel.mutedUsers.map(user => user.login).includes(socket.data.user.login)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    //console.log(message);
    // if (channel.isDirect = true && channel.getChannelUsers()) {
    //   return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    // }
    if (message.message == null || message.message == '' || message.message == '\n') {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    await this.db.setChannelMessage(socket.data.userId, channel.channelName, message.message, false); 
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
    if (users == undefined || users == null) { // NEW
      return;
    }
    for (const user of users) {
      this.sendTo(user.login, command, data);
    }
  }

  async sendNotif(text: string, channelName: string, userId: string) {
    const createdMessage: IMessage = {
      isNotif: true,
      message: text,
      from: userId,
      channelId: channelName,
      createdAt: new Date()
    };
    await this.db.setChannelMessage(userId, channelName, text, true);
    this.sendToChan(channelName, 'message', createdMessage);
  }

  @SubscribeMessage('muteUser')
  async onMuteUser(socket: Socket, muteEvent: eventI) {
    if (socket.data?.user == undefined)
      return;
    // let user: string = await this.connectedUserService.getUserLogin(socket.id);
    //console.log(muteEvent);
    let channel: IChannel= await this.db.getChannelInfo(muteEvent.from);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!channel.admins.map(user => user.login).includes(socket.data.user.login)) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (channel.creator == muteEvent.to){
      return socket.emit('Error', new UnauthorizedException()); 
    }
    muteEvent.eventDuration = 10000;
    //console.log(muteEvent);
    await this.db.setMuteUser(muteEvent.from, muteEvent.to, muteEvent.eventDuration);
    this.sendNotif(muteEvent.to + " got muted", muteEvent.from, socket.data.userId);
    channel = await this.db.getChannelInfo(muteEvent.from);
    this.sendToChan(muteEvent.from, 'channelUpdate', channel);
  }

  @SubscribeMessage('unmuteUser')
  async onUnmuteUser(socket: Socket, muteEvent: eventI) {
    if (socket.data?.user == undefined)
      return;
    let channel: IChannel= await this.db.getChannelInfo(muteEvent.from);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!channel.admins.map(user => user.login).includes(socket.data.user.login)) {
      return socket.emit('Error', new UnauthorizedException());  
    }
    await this.db.deleteMuteUser(muteEvent.from, muteEvent.to);
    // avertir le mec qui a été unmute
    this.sendNotif(muteEvent.to + " a ete unmute", muteEvent.from, socket.data.userId);
    channel = await this.db.getChannelInfo(muteEvent.from);
    this.sendToChan(muteEvent.from, 'channelUpdate', channel);
  }

  @SubscribeMessage('banUser')
  async onBanUser(socket: Socket, banEvent: eventI) {
    if (socket.data?.user == undefined)
      return;
    // let user: string = await this.connectedUserService.getUserLogin(socket.id);
    let channel: IChannel= await this.db.getChannelInfo(banEvent.from);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!channel.admins.map(user => user.login).includes(socket.data.user.login)) {
      return socket.emit('Error', new UnauthorizedException());  
    }
    if (channel.creator == banEvent.to){
      return socket.emit('Error', new UnauthorizedException()); 
    }
    this.sendNotif(banEvent.to + " got banned", banEvent.from, socket.data.userId);
    await this.db.leaveChannel(banEvent.to, banEvent.from);
    banEvent.eventDuration = 10000;
    await this.db.setBanUser(banEvent.from, banEvent.to, banEvent.eventDuration);
    // avertir le mec qui a été ban
    channel = await this.db.getChannelInfo(banEvent.from);
    this.sendToChan(banEvent.from, 'channelUpdate', channel);
  }

  @SubscribeMessage('unbanUser')
  async onUnbanUser(socket: Socket, banEvent: eventI) {
    if (socket.data?.user == undefined)
      return;
    // let user: string = await this.ConnectedUserService.getUserLogin(socket.id);
    let channel: IChannel= await this.db.getChannelInfo(banEvent.from);
    if (!channel) {
      return this.server.to(socket.id).emit('Error', new UnauthorizedException());
    }
    if (!channel.admins.map(user => user.login).includes(socket.data.user.login)) {
      return socket.emit('Error', new UnauthorizedException());  
    }
    await this.db.deleteBan(banEvent.from, banEvent.to);
    // avertir le mec qui a été unban
    this.sendNotif(banEvent.to + " got unbanned", banEvent.from, socket.data.userId);
    channel = await this.db.getChannelInfo(banEvent.from);
    this.sendToChan(banEvent.from, 'channelUpdate', channel);
  }

  // @SubscribeMessage('getBlockedUsers')
  // async onGetBlockedUsers(socket: Socket) {
  //   const blockedUsers: IAccount[] = await this.db.getBlockedUsers(socket.data.user.login); // Juan => Peut-on utiliser cette fonction pour obtenir juste un vecteur avec des logins ?
  //   socket.emit('blockedUsers', blockedUsers);
  // }

  @SubscribeMessage('blockUser')
  async onblockUser(socket: Socket, blockedLogin: string) {
    if (socket.data?.user == undefined)
      return;
    if (socket.data.user.blockUsers.includes(blockedLogin)) {
      return socket.emit('Error', new UnauthorizedException());
    }
    await this.db.setBlockUser(socket.data.userId, blockedLogin);
    let blockedUsers: string[] = (await this.db.getBlockedUsers(socket.data.user.login)).map(user => user.login); // est-ce que ça pose pb login ici ?
    socket.data.user.blockUsers = blockedUsers;
    socket.emit('myUser', socket.data.user);
    let blockers: string[] = (await this.db.getBlockers(blockedLogin)).map(user => user.login);
    this.sendTo(blockedLogin, 'blockers', blockers);
  }
  
  @SubscribeMessage('unblockUser')
  async onUnblockUser(socket: Socket, blockedLogin: string) {
    if (socket.data?.user == undefined)
      return;
    if (!socket.data.user.blockUsers.includes(blockedLogin)) {
      return socket.emit('Error', new UnauthorizedException());
    }
    await this.db.deleteBlockUser(socket.data.userId, blockedLogin);
    let blockedUsers: string[] = (await this.db.getBlockedUsers(socket.data.user.login)).map(user => user.login);
    socket.data.user.blockUsers = blockedUsers;
    socket.emit('myUser', socket.data.user);
    let blockers: string[] = (await this.db.getBlockers(blockedLogin)).map(user => user.login);
    this.sendTo(blockedLogin, 'blockers', blockers);
  }
  
  @SubscribeMessage('invite')
  async handleInvite(socket: Socket, inviteInfo: {login: string, powerup: boolean})  {
    if (socket.data?.user == undefined)
      return;
    //console.log("invite", inviteInfo.login);
    
    if (!(await this.db.isUser(inviteInfo.login)) || inviteInfo.login == socket.data.user.login)
      return socket.emit('Error', 'User not found');
    this.gameServ.invitePlayer(socket, inviteInfo.login, inviteInfo.powerup);
    let invites: string[] = await this.gameServ.getInvites(inviteInfo.login);
    this.sendTo(inviteInfo.login, 'invites', invites);
  }
  @SubscribeMessage('acceptInvite')
  async acceptInvite(socket: Socket, login: string)  {
    if (socket.data?.user == undefined)
      return;
    let socketIds: Set<string> = this.connectedUsers.get(login);
    //console.log("acceptInvite", login, socketIds);
    if (!socketIds) {
      return socket.emit('Error', 'User not connected');
    }
    this.gameServ.acceptInvite(socket, login);
  }
  async sendMatchId(login: string, gameId: number) {
    this.sendTo(login, 'matchId', gameId);
  }
  @SubscribeMessage('getInvites')
  async getInvites(socket: Socket)  {
    if (socket.data?.user == undefined)
      return;
    let invites: string[] = this.gameServ.getInvites(socket.data.user.login);
    socket.emit('invites', invites);
  }
}