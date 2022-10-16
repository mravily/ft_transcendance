import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GamePaddle, GameStatus } from './game.interface';
import { GameGateway } from './game.gateway';
import { Socket } from 'socket.io';
import { Ball, Paddle, PowerUp } from './entities';

@Injectable()

export class GameService  {
  games: Map<number, GameMatch>;
  gameIdByUserId: Map<string, number>;
  queue: Socket[];
  PUqueue: Socket[];

  constructor( @Inject(forwardRef(() => GameGateway)) private readonly wsg: GameGateway) { 
    this.games = new Map<number, GameMatch>();
    this.queue = [];
    this.PUqueue = [];
    this.gameIdByUserId = new Map<string, number>();
  }

  startGame(gameId: number, client: Socket) {
    if (!this.games.has(gameId)) {
      return;
    }
    this.games.get(gameId).startGame(client);
    this.gameIdByUserId.set(client.data.userId, gameId);
    // else  {
    //   this.games.set(gameId, new GameMatch(this.wsg, [client], true));
    //   this.games.get(gameId).startGame(client);
    // }
  }
  checkforgame(userId: string): number {
    if (this.gameIdByUserId.has(userId)) {
      return this.gameIdByUserId.get(userId);
    }
    return -1;
  }
  createGame(players: string[], powerUps: boolean): number {
    var gameId = Math.floor(Math.random() * 1000000);
    while (this.games.has(gameId)) {
      gameId = Math.floor(Math.random() * 1000000);
    }
    this.games.set(gameId, new GameMatch(this.wsg, players, powerUps));
    this.gameIdByUserId.set(players[0], gameId);
    this.gameIdByUserId.set(players[1], gameId);
    return gameId;
  }
  getMatchmakingGame(client: Socket, powerUps: boolean): void {
    let queue = (powerUps) ? this.PUqueue : this.queue;
    console.log("queue", queue);
    if (queue.length > 0) {
      var oppo = queue.pop();
      var gameId = this.createGame([client.data.userId, oppo.data.userId], powerUps);
      this.wsg.sendMatchId(client.id, gameId);
      this.wsg.sendMatchId(oppo.id, gameId);
      console.log('creating', client.data.user.login, "vs", oppo.data.user.login);
    }
    else {
      queue.push(client);
    }
    client.emit('queuing');
  }
  removeGame(userId: string) {
    if (this.gameIdByUserId.has(userId)) {
      var gameId = this.gameIdByUserId.get(userId);
      if (this.games.has(gameId)) {
        for (var player of this.games.get(gameId).playerIds) {
          this.gameIdByUserId.delete(player);
        }
        for (var player of this.games.get(gameId).playerIds) {
          this.gameIdByUserId.delete(player);
        }
        this.games.delete(gameId);
      }
    }
    console.log("running games remaining", this.games.size);
  }

  setPlayerPos(userId: string, paddle: GamePaddle) {
    if (this.gameIdByUserId.has(userId)) {
      var gameId = this.gameIdByUserId.get(userId);
      if (this.games.has(gameId)) {
        this.games.get(gameId).setPlayerPos(userId, paddle);
      }
    }
  }
  removeConnection(socket: Socket) {
    if (this.queue.includes(socket)) {
      this.queue.splice(this.queue.indexOf(socket), 1);
    }
    if (this.PUqueue.includes(socket)) {
      this.PUqueue.splice(this.queue.indexOf(socket), 1);
    }
  }
}

export class GameMatch {
  
  startGame(socket: Socket): void {
    let i = this.playerIds.indexOf(socket.data.userId);
    if (i != -1)  {
      console.log("starting game", this.socketIds);
      if (!this.socketIds.includes(socket.id)) {
        this.socketIds[i] = socket.id;
        console.log((i==0) ? 'player1' : 'player2', 'ready to start', socket.data.login);
      }
      if (!this.socketIds.includes('') && !this.idInterval)
        this.start();
      else if (!this.idInterval)
        this.wsg.sendStart([socket.id], -1);
    }
    else  {
      this.socketIdsSpec.push(socket.id);
      console.log(socket.data.user.login, 'spectating');
      this.wsg.sendSpecMode(socket);
      this.wsg.sendGameStatus(socket.id, this.getGameStatus(socket.data.userId));
    }
  }
  
  private idInterval!: NodeJS.Timer;
  private socketIds:  string[];
  public  socketIdsSpec: string[];
  private player1!: Paddle;
  private player2!: Paddle;
  private ball!: Ball;
  private cur!: number;
  private powerUps: PowerUp[];
  private lastPowerUp: number;
  
  private canvasWidth:number;
  private canvasHeight:number;
  private paddleWidth:number;
  private paddleHeight:number;
  private ballSize:number;
  private wallOffset:number;
  public player1Score: number;
  public player2Score: number;

  private period: number = 1000 / 60;
  
  constructor(private readonly wsg: GameGateway, public playerIds: string[], public custom: boolean = false) {
    
    this.canvasWidth = 1400;
    this.canvasHeight = 800;
    this.paddleWidth = 20;
    this.paddleHeight = 120;
    this.ballSize = 20;
    this.wallOffset = 20;
    this.player1Score = 0;
    this.player2Score = 0;
    
    this.lastPowerUp = 0;
    this.player1 = new Paddle(this.paddleWidth,this.paddleHeight,this.wallOffset+this.ballSize, this.canvasHeight / 2 - this.paddleHeight / 2); 
    this.player2 = new Paddle(this.paddleWidth,this.paddleHeight,this.canvasWidth - (this.wallOffset + this.paddleWidth) - this.ballSize, this.canvasWidth / 2 - this.paddleHeight / 2);
    this.ball = new Ball(this.ballSize,this.ballSize,this.canvasWidth / 2 - this.ballSize / 2, this.canvasWidth / 2 - this.ballSize / 2, this);
    this.powerUps = [];
    this.socketIds = ['', ''];
    this.socketIdsSpec = [];
  }
  
  async start(): Promise<void> {
    this.sendGameStatus();
    this.wsg.sendStart(this.socketIds, 5);
    await delay(1000);
    this.wsg.sendStart(this.socketIds, 4);
    await delay(1000);
    this.wsg.sendStart(this.socketIds, 3);
    await delay(1000);
    this.wsg.sendStart(this.socketIds, 2);
    await delay(1000);
    this.wsg.sendStart(this.socketIds, 1);
    await delay(1000);
    this.wsg.sendStart(this.socketIds, 0);
  
    this.cur = Date.now();
    this.idInterval = setInterval(() => this.gameLoop(), 1000 / 59);
  }
  
  gameLoop(){
    while (Date.now() - this.cur >= this.period)
    {
      this.update();
      this.cur += this.period;
    }
  }
  end(): void {
    clearInterval(this.idInterval);
    this.wsg.sendEnd(this.socketIds, this.socketIdsSpec, this.player1Score, this.player2Score);
    this.wsg.removeGame(this.playerIds[0]);
  }
  update_powerups(): void {
    for (let i = 0; i < this.powerUps.length; i++) {
      if (this.powerUps[i].collides(this.ball)) {
        console.log((this.ball.xVel > 0 ? 'player1' : 'player2'), 'got powerup', ["double_paddle", "large_paddle", "small_paddle", "power_paddle", "slow_paddle"][this.powerUps[i].type], 'at', this.powerUps[i].x, this.powerUps[i].y);
        if (this.ball.xVel > 0)
          this.player1.powerUp(this.powerUps[i].type);
        else
          this.player2.powerUp(this.powerUps[i].type);
        this.wsg.removePowerUp(this.socketIds, this.socketIdsSpec, this.powerUps[i], this.ball.xVel < 0);
        this.powerUps.splice(i, 1);
        i--;
      }
    }
    if (this.cur - this.lastPowerUp > 10000 && this.powerUps.length < 3) {
      this.powerUps.push(new PowerUp());
      this.wsg.newPowerUp(this.socketIds, this.socketIdsSpec, this.powerUps[this.powerUps.length - 1]);
      console.log("new powerup", this.powerUps[this.powerUps.length - 1]);
      this.lastPowerUp = this.cur;
    }
  }

  sendEndofPowerUp(idPlayer: boolean, type: number): void {
    this.wsg.sendEndofPowerUp(this.socketIds, this.socketIdsSpec, idPlayer, type);
  }

  update()  {
    this.player1.update(this.canvasHeight, this.wallOffset, this);
    this.player2.update(this.canvasHeight, this.wallOffset, this);
    this.ball.update(this.player1, this.player2, this.canvasWidth, this.canvasHeight, this.wallOffset);
    if (this.player1Score >= 10 || this.player2Score >= 10) {
      this.end();
    }

    if (this.custom)
      this.update_powerups();
    
    if (this.ball.xVel != this.ball.lastXVel || this.ball.yVel != this.ball.lastYVel || (this.ball.x > this.canvasWidth/2) != this.ball.lastXsign) {
      this.sendGameStatus();  
      this.ball.lastXVel = this.ball.xVel;
      this.ball.lastYVel = this.ball.yVel;
      this.ball.lastXsign = this.ball.x > this.canvasWidth / 2;
    }
  }

  sendGameStatus(): void {
    this.wsg.sendGameStatus(this.socketIds[0], this.getGameStatus(this.playerIds[0]));
    this.wsg.sendGameStatus(this.socketIds[1], this.getGameStatus(this.playerIds[1]));
    for (var i = 0; i < this.socketIdsSpec.length; i++) {
      this.wsg.sendGameStatus(this.socketIdsSpec[i], this.getGameStatus('spec'));
    }
  }

  getGameStatus(userId: string): GameStatus {
    if (userId == this.playerIds[1])
      return {
        timeStamp: this.cur,
        myScore: this.player2Score,
        opponentScore: this.player1Score,
        ballX: this.canvasWidth - this.ball.x - this.ball.width,
        ballY: this.ball.y,
        ballXVel: -this.ball.xVel,
        ballYVel: this.ball.yVel,
      };
    else
      return {
        timeStamp: this.cur,
        myScore: this.player1Score,
        opponentScore: this.player2Score,
        ballX: this.ball.x,
        ballY: this.ball.y,
        ballXVel: this.ball.xVel,
        ballYVel: this.ball.yVel,
      };
  }
  setPlayerPos(userId: string, paddle: GamePaddle): void {
    if (userId == this.playerIds[0])
    {
      this.player1.y = paddle.y;
      this.player1.yVel = paddle.yVel;
      this.wsg.sendPaddlePos(0, this.socketIds, this.socketIdsSpec, {y: this.player1.y, yVel: this.player1.yVel, timeStamp: paddle.timeStamp});
      while (paddle.yVel != 0 && paddle.timeStamp + this.period <= this.cur) {
        this.player1.update(this.canvasHeight, this.wallOffset, this);
        paddle.timeStamp += this.period;
      }
    }
    else if (userId == this.playerIds[1])
    {
      this.player2.y = paddle.y;
      this.player2.yVel = paddle.yVel;
      this.wsg.sendPaddlePos(1, this.socketIds, this.socketIdsSpec, {y: this.player2.y, yVel: this.player2.yVel, timeStamp: paddle.timeStamp});
      while (paddle.yVel != 0 && paddle.timeStamp + this.period <= this.cur) {
        this.player2.update(this.canvasHeight, this.wallOffset, this);
        paddle.timeStamp += this.period;
      }
    }
  }
}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}