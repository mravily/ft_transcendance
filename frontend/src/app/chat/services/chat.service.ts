import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  socket!: Socket;

  constructor() { 
    this.socket = new Socket({ url: 'ws://api/chat', options: {
      withCredentials: false,
    } });
  }

  getAddedMessage(): Observable<any> {
    return this.socket.fromEvent<any>('messageAdded');
  }

  sendMessage(message: any) {
    this.socket.emit('addMessage', message);
  }

  joinRoom(room: any) {
    this.socket.emit('joinRoom', room);
  }

  leaveRoom(room: any) {
    this.socket.emit('leaveRoom', room);
  }

  getMessages(): Observable<any> {
    return this.socket.fromEvent<any>('messages');
  }

  getMyRooms(): Observable<any> {
    return this.socket.fromEvent<any>('rooms');
  }

  emitPaginateRooms(limit: number, page: number) {
    this.socket.emit('paginateRooms', { limit, page });
  }

  createRoom(room: any) {
    this.socket.emit('createRoom', room);
  }


}
