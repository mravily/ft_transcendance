import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { IMessage, IChannel, IAccount } from '../../../interfaces';
import { PageI } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  socket!: Socket;
  
  constructor() { 
    this.socket = new Socket({ url: '/chat', options: {
      withCredentials: false,
    } });
  }
  
  getAddedMessageObs(): Observable<IMessage> {
    return this.socket.fromEvent<IMessage>('message');
  }
  sendMessage(message: IMessage) {
    this.socket.emit('addMessage', message);
  }
  getMessages(channelName: string): Observable<IMessage[]> {
    return this.socket.emit('getMessages', channelName);
  }
  getMessagesObs(): Observable<IMessage[]> {
    return this.socket.fromEvent<IMessage[]>('messages');
  }
  
  getPublicChannelsObs(): Observable<IChannel[]> {
    return this.socket.fromEvent<IChannel[]>('publicChannels');
  }
  searchPublicChannels(search: string) {
    this.socket.emit('searchPublicChannels', search);
  }
  getPublicChannels(page: PageI) {
    this.socket.emit('getPublicChannels', page);
  }
  searchUsers(search: string) {
    this.socket.emit('searchUsers', search);
  }
  getSearchUsersObs(): Observable<IAccount[]> {
    return this.socket.fromEvent<IAccount[]>('users');
  }
  createChannel(room: IChannel) {
    this.socket.emit('createChannel', room);
  }
  getDMinfo(login: string) {
    this.socket.emit('getDMinfo', login);
  }
  getChannelsObs(): Observable<IChannel[]> {
    return this.socket.fromEvent<IChannel[]>('channels');
  }
  getMyChannels(page: PageI)  {
    this.socket.emit('getMyChannels', page);
  }
  joinChannel(channelName: string, password: string) {
    this.socket.emit('joinChannel', {name: channelName, password: password});
  }
  addMember(channelName: string, login: string) {
    this.socket.emit('addMember', {channelName: channelName, login: login});
  }
  removeMember(channelName: string, login: string) {
    this.socket.emit('removeMember', {channelName: channelName, login: login});
  }
  getChannelMembersObs(): Observable<IAccount> {
    return this.socket.fromEvent<IAccount>('channelMembers');
  }
  setPassword(channelName: string, password: string) {
    this.socket.emit('updatePassword', {name: channelName, password: password});
  }
  removePassword(channelName: string) {
    this.socket.emit('updatePassword', {name: channelName});
  }
  leaveChannel(channelName: string) {
    this.socket.emit('leaveChannel', channelName);
  }
  promoteUser(channelName: string, login: string) {
    this.socket.emit('promoteToAdmin', {channelName: channelName, login: login});
  }
  banUser(channelName: string, login: string) {
    this.socket.emit('banUser', {from: channelName, to: login, eventDuration: 10000});
  }
  unbanUser(channelName: string, login: string) {
    this.socket.emit('unbanUser', {from: channelName, to: login});
  }
  muteUser(channelName: string, login: string) {
    this.socket.emit('muteUser', {from: channelName, to: login, eventDuration: 10000});
  }
  unmuteUser(channelName: string, login: string) {
    this.socket.emit('unmuteUser', {from: channelName, to: login});
  }

  getChannelInfoObs(): Observable<IChannel> {
    return this.socket.fromEvent<IChannel>('channelInfo');
  }
  getChannelUpdateObs(): Observable<IChannel> {
    return this.socket.fromEvent<IChannel>('channelUpdate');
  }
  getChannelInfo(channelName: string) {
    this.socket.emit('getChannelInfo', channelName);
  }
  getBlockersObs(): Observable<string[]> {
    return this.socket.fromEvent<string[]>('blockers');
  }

  // getChannelMutedObs(): Observable<string[]> {
  //   return this.socket.fromEvent<any>('muted');
  // }
  // getBlockedUsersObs(): Observable<string[]> {
  //   return this.socket.fromEvent<any>('blockedUsers');
  // }
  blockUser(login: string) {
    return this.socket.emit('blockUser', login);
  }
  unblockUser(login: string) {
    return this.socket.emit('unblockUser', login);
  }

  getErrorObs(): Observable<string> {
    return this.socket.fromEvent<any>('Error');
  }
  getMyUser() {
    this.socket.emit('getMyUser');
  }
  getMyUserObs(): Observable<IAccount> {
    return this.socket.fromEvent<IAccount>('myUser');
  }
  
  inviteUser(login: string, powerup: boolean) {
    this.socket.emit('invite', {login: login, powerup: powerup});
  }
  acceptInvite(login: string) {
    this.socket.emit('acceptInvite', login);
  }
  // getInviteObs(): Observable<string> {
  //   return this.socket.fromEvent<string>('invite');
  // }
  getMatchFoundObs(): Observable<number>{
    return this.socket.fromEvent<number>('matchId');
  }
  getInvitesObs(): Observable<string[]> {
    return this.socket.fromEvent<string[]>('invites');
  }
  getInvites() {
    this.socket.emit('getInvites');
  }



}
