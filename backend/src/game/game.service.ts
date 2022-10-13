import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GamePaddle, GameStatus } from './game.interface';
import { GameGateway } from './game.gateway';
import { Socket } from 'socket.io';
import { Ball, Paddle, PowerUp } from './entities';

@Injectable()

export class GameService  {
  games: Map<number, GameMatch>;
  gameidBySocketid: Map<string, number>;
  queue: Socket[];
  PUqueue: Socket[];

  constructor( @Inject(forwardRef(() => GameGateway)) private readonly wsg: GameGateway) { 
    this.games = new Map<number, GameMatch>();
    this.queue = [];
    this.gameidBySocketid = new Map<string, number>();
  }

  startGame(gameId: number, client: Socket) {
    // a suppr
    this.gameidBySocketid.set(client.id, gameId);
    if (this.games.has(gameId)) {
      this.games.get(gameId).startGame(client);
    }
    else  {
      this.games.set(gameId, new GameMatch(this.wsg, [client], true));
      this.games.get(gameId).startGame(client);
    }
  }

  createGame(players: Socket[], powerUps: boolean): number {
    var gameId = Math.floor(Math.random() * 1000000);
    while (this.games.has(gameId)) {
      gameId = Math.floor(Math.random() * 1000000);
    }
    this.games.set(gameId, new GameMatch(this.wsg, players, powerUps));
    this.gameidBySocketid.set(players[0].id, gameId);
    this.gameidBySocketid.set(players[1].id, gameId);
    return gameId;
  }
  getMatchmakingGame(client: Socket, powerUps: boolean): void {
    let queue = (powerUps) ? this.PUqueue : this.queue;
    if (queue.length > 0) {
      var oppo = queue.pop();
      var gameId = this.createGame([client, oppo], powerUps);
      this.wsg.sendMatchId(client, gameId);
      this.wsg.sendMatchId(oppo, gameId);
      console.log('creating', client.id);
    }
    else {
      queue.push(client);
    }
  }
  removeGame(player1: Socket) {
    if (this.gameidBySocketid.has(player1.id)) {
      var gameId = this.gameidBySocketid.get(player1.id);
      if (this.games.has(gameId)) {
        for (var player of this.games.get(gameId).playerSockets) {
          this.gameidBySocketid.delete(player.id);
        }
        for (var player of this.games.get(gameId).spectators) {
          this.gameidBySocketid.delete(player.id);
        }
        this.games.delete(gameId);
      }
    }
    console.log(this.games.size);
  }
  setPlayerPos(client: Socket, paddle: GamePaddle) {
    if (this.gameidBySocketid.has(client.id)) {
      var gameId = this.gameidBySocketid.get(client.id);
      if (this.games.has(gameId)) {
        this.games.get(gameId).setPlayerPos(client, paddle);
      }
    }
  }
  
}

export class GameMatch {
  idInterval!: NodeJS.Timer;
  
  startGame(socket: Socket): void {
    if (!this.playerSockets.includes(socket) && this.playerSockets.length < 2) {
      this.playerSockets.push(socket);
    }
    // ^ a supprimer ^
    if (this.playerSockets.includes(socket))  {
      if (!this.ready.includes(socket)) {
        this.ready.push(socket);
        console.log((this.playerSockets[0]===socket)?'player1':'player2', 'ready to start', socket.id);
      }
      if (this.ready.length == 2) {
        this.wsg.sendGameStatus(this.playerSockets[0], this.getGameStatus(this.playerSockets[0]));
        this.wsg.sendGameStatus(this.playerSockets[1], this.getGameStatus(this.playerSockets[1]));
        this.start();
      }
      else
        this.wsg.sendStart([socket], -1);
    }
    else  {
      this.spectators.push(socket);
      console.log(socket.id, 'spectating');
      this.wsg.sendSpecMode(socket);
      this.wsg.sendGameStatus(socket, this.getGameStatus(socket));
    }  
  }
  private powerUps: PowerUp[];
  private ready: Socket[];
  public spectators: Socket[];
  private player1!: Paddle;
  private player2!: Paddle;
  private ball!: Ball;
  private cur!: number;
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
  
  constructor(private readonly wsg: GameGateway, public playerSockets: Array<Socket>, public custom: boolean = false) {
    
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
    this.ready = [];
    this.spectators = [];
  }
  
  async start(): Promise<void> {
    this.wsg.sendStart(this.playerSockets, 5);
    await delay(1000);
    this.wsg.sendStart(this.playerSockets, 4);
    await delay(1000);
    this.wsg.sendStart(this.playerSockets, 3);
    await delay(1000);
    this.wsg.sendStart(this.playerSockets, 2);
    await delay(1000);
    this.wsg.sendStart(this.playerSockets, 1);
    await delay(1000);
    this.wsg.sendStart(this.playerSockets, 0);
    
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
    this.wsg.sendEnd(this.playerSockets, this.spectators, this.player1Score, this.player2Score);
  }
  update_powerups(): void {
    for (let i = 0; i < this.powerUps.length; i++) {
      if (this.powerUps[i].collides(this.ball)) {
        console.log((this.ball.xVel > 0 ? 'player1' : 'player2'), 'got powerup', ["double_paddle", "large_paddle", "small_paddle", "power_paddle", "slow_paddle"][this.powerUps[i].type], 'at', this.powerUps[i].x, this.powerUps[i].y);
        if (this.ball.xVel > 0)
          this.player1.powerUp(this.powerUps[i].type);
        else
          this.player2.powerUp(this.powerUps[i].type);
        this.wsg.removePowerUp(this.playerSockets, this.spectators, this.powerUps[i], this.ball.xVel < 0);
        this.powerUps.splice(i, 1);
        i--;
      }
    }
    if (this.cur - this.lastPowerUp > 10000 && this.powerUps.length < 3) {
      this.powerUps.push(new PowerUp());
      this.wsg.newPowerUp(this.playerSockets, this.spectators, this.powerUps[this.powerUps.length - 1]);
      console.log("new powerup", this.powerUps[this.powerUps.length - 1]);
      this.lastPowerUp = this.cur;
    }
  }

  sendEndofPowerUp(idPlayer: boolean, type: number): void {
    this.wsg.sendEndofPowerUp(this.playerSockets, this.spectators, idPlayer, type);
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
      this.wsg.sendGameStatus(this.playerSockets[0], this.getGameStatus(this.playerSockets[0]));
      this.wsg.sendGameStatus(this.playerSockets[1], this.getGameStatus(this.playerSockets[1]));
      for (var i = 0; i < this.spectators.length; i++) {
        this.wsg.sendGameStatus(this.spectators[i], this.getGameStatus(this.playerSockets[0]));
      }
      this.ball.lastXVel = this.ball.xVel;
      this.ball.lastYVel = this.ball.yVel;
      this.ball.lastXsign = this.ball.x > this.canvasWidth/2;
    }
  }

  getGameStatus(client: Socket): GameStatus {
    if (client == this.playerSockets[0])
      return {
        timeStamp: this.cur,
        myScore: this.player1Score,
        opponentScore: this.player2Score,
        ballX: this.ball.x,
        ballY: this.ball.y,
        ballXVel: this.ball.xVel,
        ballYVel: this.ball.yVel,
      };
    else if (client == this.playerSockets[1])
      return {
        timeStamp: this.cur,
        myScore: this.player2Score,
        opponentScore: this.player1Score,
        ballX: this.canvasWidth - this.ball.x - this.ball.width,
        ballY: this.ball.y,
        ballXVel: -this.ball.xVel,
        ballYVel: this.ball.yVel,
      };
  }
  setPlayerPos(client: Socket, paddle: GamePaddle): void {
    if (client == this.playerSockets[0])
    {
      this.player1.y = paddle.y;
      this.player1.yVel = paddle.yVel;
      this.wsg.sendPaddlePos(0, this.playerSockets[1], this.spectators, {y: this.player1.y, yVel: this.player1.yVel, timeStamp: paddle.timeStamp});
      while (paddle.yVel != 0 && paddle.timeStamp + this.period <= this.cur) {
        this.player1.update(this.canvasHeight, this.wallOffset, this);
        paddle.timeStamp += this.period;
      }
    }
    else if (client == this.playerSockets[1])
    {
      this.player2.y = paddle.y;
      this.player2.yVel = paddle.yVel;
      this.wsg.sendPaddlePos(1, this.playerSockets[0], this.spectators, {y: this.player2.y, yVel: this.player2.yVel, timeStamp: paddle.timeStamp});
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