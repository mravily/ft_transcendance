import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { IMatch } from 'src/app/interfaces';
import { IAccount } from 'src/app/model/user.model';
import { Message } from '../models/chat.models';
import { PaddlePos, GameStatus, PowerUpEvent, Results } from '../models/pong.models';

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
  syncEvent: Observable<number>;
  redirectToLobbyEvent: Observable<void>;
  matchUsersEvent: Observable<IAccount[]>;
  liveGamesEvent: Observable<IMatch[]>;

  constructor(private cookieService: CookieService) {
    this.socket = new Socket({ url: '/pong', options: {
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
    this.syncEvent = this.socket.fromEvent<number>('sync');
    this.redirectToLobbyEvent = this.socket.fromEvent<void>('redirectToLobby');
    this.matchUsersEvent = this.socket.fromEvent<IAccount[]>('matchUsers');
    this.liveGamesEvent = this.socket.fromEvent<IMatch[]>('liveGames');
  }

  getLiveGames(): void {
    this.socket.emit('getLiveGames');
  }
  getNewMatchmaking(): void {
    this.socket.emit('findMatch');
  }
  getNewPUMatchmaking(): void {
    this.socket.emit('findPUMatch');
  }

  sendPaddlePos(y: number, yVel: number, timestamp: number): void {
    this.socket.emit('paddle', {y: y, yVel: yVel, timeStamp: timestamp});
  }

  sendStartGame(gameId: number): void {
    this.socket.emit('startGame', gameId);
  }

  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  sendSync(): number {
    let t = Date.now();
    this.socket.emit('sync', t);
    return t;
  }
  //
  invitePlayer(playerId: number): void {
    this.socket.emit('invite', playerId);
  }
}

