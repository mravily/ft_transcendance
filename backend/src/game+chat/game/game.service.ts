import { forwardRef, Global, Inject, Injectable } from '@nestjs/common';
import { GamePaddle } from './game.interface';
import { GameGateway } from './game.gateway';
import { Socket } from 'socket.io';
import { ChatGateway } from '../chat/gateway/chat.gateway';
import { IAccount, IMatch } from '../../interfaces';
import { PrismaService } from '../../prisma.service';
import { GameMatch } from './GameMatch.class';

@Injectable()
export class GameService {
  games: Map<number, GameMatch>;
  gameIdByLogin: Map<string, number>;
  invites: Map<string, any>;
  queue: string[];
  PUqueue: string[];

  constructor(
    @Inject(forwardRef(() => GameGateway)) private readonly wsg: GameGateway,
    @Inject(forwardRef(() => ChatGateway)) private readonly chatGW: ChatGateway,
    public db: PrismaService,
  ) {
    //console.log('Game Service created');
    this.games = new Map<number, GameMatch>();
    this.invites = new Map<string, any>();
    this.queue = [];
    this.PUqueue = [];
    this.gameIdByLogin = new Map<string, number>();
  }

  async startGame(gameId: number, client: Socket) {
    
    if (!this.games.has(gameId)) {
      this.gameIdByLogin.delete(client.data.user.login);
      // console.log("no game", client.data.user.login, gameId, this.games.keys());
      return this.wsg.redirectToLobby(client.id);
    }
    
    this.games.get(gameId).startGame(client);
    // console.log(client.data.user.login, 'sending players', gameId);
    const users = await this.games.get(gameId).getPlayersAccounts();
    users.sort(
      (a, b) =>
        (a.login == client.data.user.login ? 0 : 1) -
        (b.login == client.data.user.login ? 0 : 1),
    );
    this.wsg.sendMatchUsers(client.id, users);
  }

  checkforgame(login: string) {
    // console.log('checking game for', login);
    if (this.gameIdByLogin.has(login))
      return this.gameIdByLogin.get(login);
    return -1;
  }

  createGame(players: string[], powerUps: boolean): number {
    let gameId: number = Math.floor(Math.random() * 1000000);
    while (this.games.has(gameId)) {
      gameId = Math.floor(Math.random() * 1000000);
    }
    this.games.set(gameId, new GameMatch(this.wsg, players, powerUps, this.db));
    
    this.gameIdByLogin.set(players[0], gameId);
    this.gameIdByLogin.set(players[1], gameId);
    console.log(
      'creating',
      players[0],
      'vs',
      players[1], gameId
    );
    return gameId;
  }
  getQueuesInfo(client: Socket) {
    let login = client.data.user.login;

    if (this.queue.includes(login)) {
      client.emit('queuing', {PU: false, joined: true});
    }
    if (this.PUqueue.includes(login)) {
      client.emit('queuing', {PU: true, joined: true});
    }
  }
  getMatchmakingGame(client: Socket, powerUps: boolean): void {
    let login = client.data.user.login;
    let queue = (powerUps) ? this.PUqueue : this.queue;
    let otherqueue = (!powerUps) ? this.PUqueue : this.queue;

    if (queue.includes(login)) {
      queue.splice(queue.indexOf(login), 1);
      client.emit('queuing', {PU: powerUps, joined: true});
      return;
    }
    else if (queue.length > 0) {
      var oppo = queue.pop();
      if (otherqueue.includes(oppo))
        otherqueue.splice(queue.indexOf(oppo), 1);
      if (otherqueue.includes(login))
        otherqueue.splice(queue.indexOf(login), 1);
      var gameId = this.createGame([login, oppo], powerUps);
      this.chatGW.sendMatchId(login, gameId);
      this.chatGW.sendMatchId(oppo, gameId);
    } else {
      queue.push(login);
    }
    client.emit('queuing', {PU: powerUps, joined: true});
  }
  cancelMatchmaking(client: Socket, PU: boolean): void {
    let login = client.data.user.login;
    let queue = (PU) ? this.PUqueue : this.queue;
    if (queue.includes(login)) {
      queue.splice(queue.indexOf(login), 1);
    }
    client.emit('queuing', {PU: PU, joined: false});
  }

  getInvites(login: string) {
    let res: string[] = [];
    for (var invite of this.invites.entries()) {
      if (invite[1][0] == login)
        res.push(invite[0]);
    }
    return res;
  }
  
  getInvited(login: string) {
    return this.invites.get(login);
  }

  invitePlayer(client: Socket, login: string, powerup: boolean) {
    this.invites.set(client.data.user.login, [login, powerup]);
  }
  acceptInvite(client: Socket, login: string) {
    if (!this.invites.has(login))
      return;
    var invited = this.invites.get(login);
    if (invited[0] != client.data.user.login)
      return;
    this.invites.delete(login);
    //console.log("invite accepted", client.data.user.login, "vs", login);
    let gameId = this.createGame([login, client.data.user.login], invited[1]);
    this.chatGW.sendMatchId(client.data.user.login, gameId);
    this.chatGW.sendMatchId(login, gameId);
  }
  removeGame(login: string) {
    if (this.gameIdByLogin.has(login)) {
      const gameId = this.gameIdByLogin.get(login);
      if (this.games.has(gameId)) {
        for (var player of this.games.get(gameId).playerLogins) {
          this.gameIdByLogin.delete(player);
        }
        this.games.delete(gameId);
      }
    }
    // console.log("running games remaining", this.games.size);
  }

  setPlayerPos(login: string, paddle: GamePaddle) {
    if (this.gameIdByLogin.has(login)) {
      const gameId = this.gameIdByLogin.get(login);
      if (this.games.has(gameId)) {
        this.games.get(gameId).setPlayerPos(login, paddle);
      }
    }
  }
  removeConnection(socket: Socket) {
    let login = socket.data.user.login;
    if (this.queue.includes(login)) {
      this.queue.splice(this.queue.indexOf(login), 1);
    }
    if (this.PUqueue.includes(login)) {
      this.PUqueue.splice(this.queue.indexOf(login), 1);
    }
    this.invites.delete(socket.data.user.login);
  }
  async getLiveGames(): Promise<IMatch[]> {
    var res: IMatch[] = [];

    for (var gameId of this.games.keys()) {
      let game = this.games.get(gameId);
      let users: IAccount[] = await game.getPlayersAccounts();
      res.push({
        gameId: gameId,
        winner: game.playerLogins[0],
        winnerScore: game.player1Score,
        winnerAvatar: users[0].avatar,
        looser: game.playerLogins[1],
        looserScore: game.player2Score,
        looserAvatar: users[1].avatar,
      });
    }
    return res;
  }

  sendMessage(login: string, message: {gameId: number, text: string}) {
    if (this.games.has(message.gameId)) {
      this.games.get(message.gameId).sendMessage(login, message.text);
    }
  }
}
