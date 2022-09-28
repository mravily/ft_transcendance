import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { GameStatus, PaddlePos, PowerUpEvent, Results } from 'src/app/pong/models/pong.models';
import { Message } from '../models/chat.models';

@Injectable({
	providedIn: "root"
})
export class PongService {
  socket: Socket;
  gameFoundEvent: Observable<number>;
  paddleEvent: Observable<PaddlePos>;
  myPaddleEvent: Observable<PaddlePos>;
  gameEvent: Observable<GameStatus>;
  startEvent: Observable<number>;
  messageEvent: Observable<Message>;
  specModeEvent: Observable<void>;
  powerUpEvent: Observable<PowerUpEvent>;
  endEvent: Observable<Results>;

  constructor() { 
    this.socket = new Socket({ url: 'localhost:3000/pong', options: {
      withCredentials: false,
    } });
    this.gameFoundEvent = this.socket.fromEvent<number>('matchId');
    this.paddleEvent = this.socket.fromEvent<PaddlePos>('paddle');
    this.myPaddleEvent = this.socket.fromEvent<PaddlePos>('myPaddle');
    this.gameEvent = this.socket.fromEvent<GameStatus>('gameState');
    this.startEvent = this.socket.fromEvent<number>('startGame');
    this.messageEvent = this.socket.fromEvent<Message>('message');
    this.specModeEvent = this.socket.fromEvent<void>('specMode');
    this.powerUpEvent = this.socket.fromEvent<PowerUpEvent>('powerUp');
    this.endEvent = this.socket.fromEvent<Results>('endGame');
  }

  getNewMatchmaking(): void {
    this.socket.emit('findMatch');
  }
  getNewPUMatchmaking(): void {
    this.socket.emit('findPUMatch');
  }

  sendPaddlePos(y: number, yVel: number): void {
    this.socket.emit('paddle', {y: y, yVel: yVel});
  }

  sendStartGame(gameId: number): void {
    this.socket.emit('startGame', gameId);
  }

  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  //
  invitePlayer(playerId: number): void {
    this.socket.emit('invite', playerId);
  }
}

