import { forwardRef, Inject } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { PowerUp } from './entities';
import { GamePaddle, GameStatus } from './game.interface';
import { GameService } from './game.service';

@WebSocketGateway( { namespace: '/pong',
                      cors: { origin: [ 'localhost:4200']  } } ) 
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;
  
  constructor( @Inject(forwardRef(() => GameService)) private gameService: GameService) {
  }
  afterInit(server: Server) {
    console.log('GameGateway initialized');
    this.wss = server;
  }
  
  handleConnection(client: Socket, ...args: any[]): void {
    console.log('Client connected', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('findMatch')
  findMatch(client: Socket): void {
    this.gameService.getMatchmakingGame(client, false);
  }
  @SubscribeMessage('findPUMatch')
  findPUMatch(client: Socket): void {
    this.gameService.getMatchmakingGame(client, true);
  }
  sendMatchId(client: Socket, gameId: number): void {
    client.emit('matchId', gameId);
  }

  @SubscribeMessage('startGame')
  handleStart(client: Socket, gameId: number): void {
    this.gameService.startGame(gameId, client);
  }
  sendStart(clients: Socket[], compteur: number) {
    for (var i = 0; i < clients.length; i++) {
      clients[i].emit('startGame', compteur);
    }
  }
  sendSpecMode(client: Socket): void {
    client.emit('specMode');
    client.emit('startGame', 0);
  }
  
  @SubscribeMessage('paddle')
  handlePaddle(client: Socket, payload: GamePaddle): void {
    this.gameService.setPlayerPos(client, payload);
  }
  
  sendPaddlePos(numPlayer: number, client: Socket, specs: Socket[], payload: GamePaddle): void {
    if (client)
      client.emit('paddle', payload);
    if (specs)  {
      let msg = 'paddle';
      if (numPlayer == 0)
        msg = 'myPaddle';
      for (var i = 0; i < specs.length; i++) {
        specs[i].emit('paddle', payload);
      }
    }
  }

  sendGameStatus(client: Socket, payload: GameStatus): void {
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
  handleMessage(client: Socket, payload: string): void {
    this.wss.emit('message', {sender: client.id, body: payload});
  }

}

