import { forwardRef, Global, Inject, Req, Session, Sse } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { session } from 'passport';
import { Socket, Server } from 'socket.io';
import { PowerUp } from './entities';
import { GamePaddle, GameStatus } from './game.interface';
import { GameService } from './game.service';
// import type { Request } from 'express';
import { AuthService } from '../../auth/auth.service';
import { parse } from 'cookie';
import { IAccount } from '../../interfaces';
import { PrismaService } from '../../prisma.service';
// import { ChatGateway } from 'src/chat/gateway/chat.gateway';

@WebSocketGateway({
  namespace: '/pong',
  cors: { origin: ['localhost:4200', '*'] },
  // allowRequest: async (req, callback) => {
  //   callback(null, true);
  // }
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  constructor(
    @Inject(forwardRef(() => GameService)) private gameService: GameService,
    private authService: AuthService,
    // private chatgw: ChatGateway,
    private db: PrismaService,
  ) {}

  afterInit(server: Server) {
    //console.log('GameGateway initialized');
    this.wss = server;
  }

  // , @Session() session: Record<string, any>,
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
      // client.emit('myId', userId);
    } catch (e) {
      //console.log('Error', e);
      client.disconnect();
      return;
    }
    try {
      const user: IAccount = await this.db.getUserAccount(client.data.userId);
      // console.log('User', user);
      if (user.login == undefined) {
        //console.log('User', user);
        return client.disconnect();
      }
      client.data.user = user; // save user in client
      client.emit('myUser', user);
      // Save connection
      // this.gameService.addConnection(client);
    } catch {
      //console.log('Error', 'connection failed');
      return client.disconnect();
    }
    //console.log('Client connected to pong', {
    //   login: client.data.user.login,
    //   socketId: client.id,
    //   userId: client.data.userId,
    // });
  }

  async handleDisconnect(client: Socket) {
    this.gameService.removeConnection(client);
    //console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('sync')
  async sync(client: Socket) {
    client.emit('sync', Date.now());
    //console.log('sync', client.id);
  }
  // @SubscribeMessage('checkforgame')
  // checkforgame(client: Socket) {
  //   let gameid = this.gameService.checkforgame(client.data.user.login);
  //   this.sendMatchId(client.id, gameid);
  // }

  // @SubscribeMessage('invite')
  // async handleInvite(client: Socket, login: string)  {
  //   if (!(await this.db.isUser(login)))
  //     return client.emit('Error', 'User not found');
  //   this.gameService.invitePlayer(client, login);
  //   this.chatgw.sendInvite(client, login);
  // }
  // @SubscribeMessage('acceptInvite')
  // async acceptInvite(client: Socket, login: string) {
  //   this.gameService.acceptInvite(client, login);
  //   this.gameService.createGame([client.data.user.login, login], false);
  // }
  @SubscribeMessage('getLiveGames')
  async getLiveGames(client: Socket) {
    let games = await this.gameService.getLiveGames();
    client.emit('liveGames', games);
  }

  @SubscribeMessage('getMyUser')
  async getMyUser(client: Socket) {
    if (client.data?.user == undefined)
      return;
    client.emit('myUser', client.data.user);
  }

  @SubscribeMessage('findMatch')
  async findMatch(client: Socket) {
    if (client.data?.user == undefined)
      return;
    this.gameService.getMatchmakingGame(client, false);
    // console.log('find', client.id );
  }

  @SubscribeMessage('findPUMatch')
  async findPUMatch(client: Socket) {
    if (client.data?.user == undefined)
      return;
    this.gameService.getMatchmakingGame(client, true);
  }
  async sendMatchId(sockId: string, gameId: number) {
    this.wss.to(sockId).emit('matchId', gameId);
  }

  @SubscribeMessage('startGame')
  async handleStart(client: Socket, gameId: number) {
    if (client.data?.user == undefined)
      return;
    this.gameService.startGame(gameId, client);
  }
  
  sendStart(sockIds: string[], compteur: number) {
    for (let i = 0; i < sockIds.length; i++) {
      this.wss.to(sockIds[i]).emit('startGame', compteur);
    }
  }
  sendMatchUsers(sockId: string, users: IAccount[]) {
    this.wss.to(sockId).emit('matchUsers', users);
  }

  async redirectToLobby(client: Socket) {
    client.emit('redirectToLobby');
  }
  async sendSpecMode(client: Socket) {
    client.emit('specMode');
    client.emit('startGame', 0);
  }

  @SubscribeMessage('paddle')
  async handlePaddle(client: Socket, payload: GamePaddle) {
    if (client.data?.user == undefined)
      return;
    this.gameService.setPlayerPos(client.data.user.login, payload);
  }

  async sendPaddlePos(
    numPlayer: number,
    sockIds: string[],
    specs: string[],
    payload: GamePaddle,
  ) {
    this.wss.to(sockIds[1 - numPlayer]).emit('paddle', payload);
    if (specs) {
      const msg = numPlayer == 0 ? 'myPaddle' : 'paddle';
      specs.forEach((s) => this.wss.to(s).emit(msg, payload));
    }
  }

  async sendGameStatus(sockId: string, payload: GameStatus) {
    this.wss.to(sockId).emit('gameState', payload);
  }
  powForPlayer2(powerUp: PowerUp): PowerUp {
    const pow: PowerUp = new PowerUp();
    pow.size = powerUp.size;
    pow.type = powerUp.type;
    pow.x = 1400 - powerUp.x - pow.size;
    pow.y = powerUp.y;
    return pow;
  }
  newPowerUp(playerSockets: string[], spectators: string[], powerUp: any) {
    this.wss
      .to(playerSockets[0])
      .emit('powerUp', { subject: 'add', ...powerUp });
    this.wss
      .to(playerSockets[1])
      .emit('powerUp', { subject: 'add', ...this.powForPlayer2(powerUp) });
    for (let i = 0; i < spectators.length; i++) {
      this.wss
        .to(spectators[i])
        .emit('powerUp', { subject: 'add', ...powerUp });
    }
  }
  removePowerUp(
    playerSockets: string[],
    spectators: string[],
    powerUp: PowerUp,
    idPlayer: boolean,
  ) {
    this.wss
      .to(playerSockets[0])
      .emit('powerUp', { subject: idPlayer ? '1' : '0', ...powerUp });
    this.wss.to(playerSockets[1]).emit('powerUp', {
      subject: !idPlayer ? '1' : '0',
      ...this.powForPlayer2(powerUp),
    });
    for (let i = 0; i < spectators.length; i++) {
      this.wss
        .to(spectators[i])
        .emit('powerUp', { subject: idPlayer ? '1' : '0', ...powerUp });
    }
  }
  sendEndofPowerUp(
    playerSockets: string[],
    spectators: string[],
    idPlayer: boolean,
    type: number,
  ) {
    this.wss
      .to(playerSockets[0])
      .emit('powerUp', { subject: idPlayer ? '1' : '0', type: type, size: 0 });
    this.wss
      .to(playerSockets[1])
      .emit('powerUp', { subject: !idPlayer ? '1' : '0', type: type, size: 0 });
    for (let i = 0; i < spectators.length; i++) {
      this.wss.to(spectators[i]).emit('powerUp', {
        subject: idPlayer ? '1' : '0',
        type: type,
        size: 0,
      });
    }
  }
  sendEnd(
    socketIds: string[],
    sockIdsSpec: string[],
    player1Score: number,
    player2Score: number,
  ) {
    this.wss.to(socketIds[0]).emit('endGame', {
      yourScore: player1Score,
      opponentScore: player2Score,
    });
    this.wss.to(socketIds[1]).emit('endGame', {
      yourScore: player2Score,
      opponentScore: player1Score,
    });
    sockIdsSpec.forEach((sockId) => {
      this.wss.to(sockId).emit('endGame', {
        yourScore: player1Score,
        opponentScore: player2Score,
      });
    });

  }
  removeGame(login: string) {
    this.gameService.removeGame(login);
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: string)  {
    if (client.data?.user == undefined)
      return;
    this.gameService.sendMessage(client.data.user.login, payload);
  }
  sendMessage(
    sockIds: string[],
    specs: string[],
    sender: string,
    payload: string,
  ) {
    sockIds.forEach((s) =>
      this.wss.to(s).emit('message', { sender: sender, body: payload }),
    );
    specs.forEach((s) =>
      this.wss.to(s).emit('message', { sender: sender, body: payload }),
    );
  }
}
