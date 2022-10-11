import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { IMessage, IChannel, IAccount } from '../../interfaces';
// import { channelI } from '../models/channel.model';
import { PageI } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  socket!: Socket;
  
  constructor() { 
    this.socket = new Socket({ url: 'localhost:4200/chat', options: {
      withCredentials: false,
    } });
  }
  
  getAddedMessageObs(): Observable<any> {
    return this.socket.fromEvent<any>('message');
  }
  sendMessage(message: IMessage) {
    this.socket.emit('addMessage', message);
  }
  getMessagesObs(): Observable<IMessage[]> {
    return this.socket.fromEvent<any>('messages');
  }
  
  getPublicChannelsObs(): Observable<IChannel[]> {
    return this.socket.fromEvent<IChannel[]>('publicChannels');
  }
  searchPublicChannels(search: string) {
    this.socket.emit('searchPublicChannels', search);
  }
  getPublicChannels(page: PageI) {
    this.socket.emit('searchPublicChannels', page);
  }

  createChannel(room: IChannel) {
    this.socket.emit('createChannel', room);
  }
  createDM(login1: string, login2: string) {
    let room : IChannel = {
      channelName: login1 + login2,
      is_pwd: false, password: "", 
      isDirect: true, isPrivate: true,
      users: [{login: login1}, {login: login2}], creator: "DM"};
    this.socket.emit('createChannel', room);
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
  getChannelMembersObs(): Observable<IAccount> {
    return this.socket.fromEvent<IAccount>('channelMembers');
  }
  setPassword(channelName: string, password: string) {
    this.socket.emit('updatePassword', {name: channelName, password: password});
  }
  removePassword(channelName: string) {
    this.socket.emit('updatePassword', {channelName: channelName});
  }
  leaveChannel(channelName: string) {
    this.socket.emit('leaveChannel', channelName);
  }
  promoteUser(channelName: string, id: string) {
    this.socket.emit('promoteToAdmin', {channelName: channelName, username: id});
  }
  banUser(channelName: string, id: string) {
    this.socket.emit('banUser', {from: channelName, to: id});
  }
  muteUser(channelName: string, id: string) {
    this.socket.emit('muteUser', {from: channelName, to: id});
  }

  getChannelInfoObs(): Observable<IChannel> {
    return this.socket.fromEvent<IChannel>('channelInfo');
  }
  getChannelInfo(channelName: string) {
    this.socket.emit('getChannelInfo', channelName);
  }

  getChannelMutedObs(): Observable<string[]> {
    return this.socket.fromEvent<any>('muted');
  }
  getBlockedUsersObs(): Observable<string[]> {
    return this.socket.fromEvent<any>('blockedUsers');
  }

  getErrorObs(): Observable<string> {
    return this.socket.fromEvent<any>('Error');
  }
  getMyIdObs(): Observable<string> {
    return this.socket.fromEvent<any>('myId');
  }
  // userblocked userunblocked



}
