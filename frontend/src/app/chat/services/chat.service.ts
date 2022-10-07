import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { channelI } from '../models/channel.model';
import { MessageI, PageI } from '../models/chat.model';

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
  sendMessage(message: MessageI) {
    this.socket.emit('addMessage', message);
  }
  getMessagesObs(): Observable<MessageI[]> {
    return this.socket.fromEvent<any>('messages');
  }
  
  getPublicChannelsObs(): Observable<string[]> {
    return this.socket.fromEvent<any>('publicChannels');
  }
  searchPublicChannels(search: string) {
    this.socket.emit('searchPublicChannels', search);
  }
  getPublicChannels(page: PageI) {
    this.socket.emit('searchPublicChannels', page);
  }

  createChannel(room: channelI) {
    this.socket.emit('createChannel', room);
  }
  createDM(login1: string, login2: string) {
    let room : channelI = {
      channelName: login1 + login2,
      is_pwd: false, pwd: "", 
      isDirect: true, isPrivate: true,
      userList: [login1, login2], creator: "DM"};
    this.socket.emit('createChannel', room);
  }
  getChannelsObs(): Observable<string[]> {
    return this.socket.fromEvent<string[]>('channels');
  }
  getMyChannels(page: PageI)  {
    this.socket.emit('getMyChannels', page);
  }
  joinChannel(channelName: string, password: string) {
    this.socket.emit('joinChannel', {name: channelName, password: password});
  }
  getChannelMembersObs(): Observable<any> {
    return this.socket.fromEvent<any>('channelMembers');
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

  getChannelInfoObs(): Observable<channelI> {
    return this.socket.fromEvent<channelI>('channelInfo');
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
