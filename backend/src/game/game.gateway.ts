import { forwardRef, Inject, Req, Session, Sse } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { session } from 'passport';
import { Socket, Server } from 'socket.io';
import { PowerUp } from './entities';
import { GamePaddle, GameStatus } from './game.interface';
import { GameService } from './game.service';
// import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { parse } from 'cookie';


@WebSocketGateway( { namespace: '/pong',
                      cors: { origin: [ 'localhost:4200', '*'],},
                      // allowRequest: async (req, callback) => {
                      //   callback(null, true);
                      // }
                    } ) 
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;
  
  constructor( @Inject(forwardRef(() => GameService)) private gameService: GameService, private authService: AuthService ) {
  }
  afterInit(server: Server) {
    console.log('GameGateway initialized');
    this.wss = server;
  }

  // , @Session() session: Record<string, any>,
  async handleConnection(client: Socket)  {
    // try {
    //   const cookie = parse(client.handshake.headers.cookie);
    //   const token = cookie['token'];
    //   if (!token) {
    //     console.log('token not found');
    //     client.disconnect();
    //     return;
    //   }
    //   const userId = await this.authService.getUseridFromToken(token);
    //   if (!userId) {
    //     console.log('User not found');
    //     client.disconnect();
    //     return;
    //   }
    //   client.data.userId = userId;
    // }
    // catch (e) {
    //   console.log('Error', e);
    //   client.disconnect();
    // }
    console.log('Client connected', client.id, client.data);
  }
  
  async handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('sync')
  async sync(client: Socket) {
    client.emit('sync', Date.now());
    console.log('sync', client.id );
  }

  @SubscribeMessage('findMatch')
  async findMatch(client: Socket) {
    this.gameService.getMatchmakingGame(client, false);
    console.log('find', client.id );
  }
  @SubscribeMessage('findPUMatch')
  async findPUMatch(client: Socket) {
    this.gameService.getMatchmakingGame(client, true);
  }
  async sendMatchId(client: Socket, gameId: number) {
    client.emit('matchId', gameId);
  }

  @SubscribeMessage('startGame')
  async handleStart(client: Socket, gameId: number) {
    this.gameService.startGame(gameId, client);
  }
  sendStart(clients: Socket[], compteur: number) {
    for (var i = 0; i < clients.length; i++) {
      clients[i].emit('startGame', compteur);
    }
  }
  async sendSpecMode(client: Socket)  {
    client.emit('specMode');
    client.emit('startGame', 0);
  }
  
  @SubscribeMessage('paddle')
  async handlePaddle(client: Socket, payload: GamePaddle) {
    this.gameService.setPlayerPos(client, payload);
  }
  
  async sendPaddlePos(numPlayer: number, client: Socket, specs: Socket[], payload: GamePaddle)  {
    if (client)
      client.emit('paddle', payload);
    if (specs)  {
      let msg = (numPlayer == 0) ? 'myPaddle' : 'paddle';
      specs.forEach(s => s.emit(msg, payload));
    }
  }

  async sendGameStatus(client: Socket, payload: GameStatus) {
    client.emit('gameState', payload);
  }
  powForPlayer2(powerUp: PowerUp): PowerUp {
    var pow: PowerUp = new PowerUp();
    pow.size = powerUp.size;
    pow.type = powerUp.type;
    pow.x = 1400 - powerUp.x - pow.size;
    pow.y = powerUp.y;
    return pow;
  }
  newPowerUp(playerSockets: Socket[], spectators: Socket[], powerUp: any) {
    playerSockets[0].emit('powerUp', {subject: "add", ...powerUp});
    playerSockets[1].emit('powerUp', {subject: "add", ...this.powForPlayer2(powerUp)});
    for (var i = 0; i < spectators.length; i++) {
      spectators[i].emit('powerUp', {subject: "add", ...powerUp});
    }
  }
  removePowerUp(playerSockets: Socket[], spectators: Socket[], powerUp: PowerUp, idPlayer: boolean) {
    playerSockets[0].emit('powerUp', {subject: idPlayer?"1":"0", ...powerUp});
    playerSockets[1].emit('powerUp', {subject: (!idPlayer)?"1":"0", ...this.powForPlayer2(powerUp)});
    for (var i = 0; i < spectators.length; i++) {
      spectators[i].emit('powerUp', {subject: idPlayer?"1":"0", ...powerUp});
    }
  }
  sendEndofPowerUp(playerSockets: Socket[], spectators: Socket[], idPlayer: boolean, type: number){
    playerSockets[0].emit('powerUp', {subject: idPlayer?"1":"0", type: type, size: 0});
    playerSockets[1].emit('powerUp', {subject: (!idPlayer)?"1":"0", type: type, size: 0});
    for (var i = 0; i < spectators.length; i++) {
      spectators[i].emit('powerUp', {subject: idPlayer?"1":"0", type: type, size: 0});
    }
  }
  sendEnd(playerSockets: Socket[], spectators: Socket[], player1Score: number, player2Score: number) {
    playerSockets[0].emit('endGame', {yourScore: player1Score, opponentScore: player2Score});
    playerSockets[1].emit('endGame', {yourScore: player2Score, opponentScore: player1Score});
    for (var i = 0; i < spectators.length; i++) {
      spectators[i].emit('endGame', {yourScore: player1Score, opponentScore: player2Score});
    }
    this.gameService.removeGame(playerSockets[0]);
  }
  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: string)  {
    this.wss.emit('message', {sender: client.id, body: payload});
  }

}

// function fetchSession(req: Request) {
//   return new Promise((resolve, reject) => {
//     session(req, {} as Response, () => {
//       resolve(req.session);
//     });
//   }
// }

