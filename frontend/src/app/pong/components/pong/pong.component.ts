import { AfterViewInit, Component, Directive, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { map, tap, take, Subscription } from 'rxjs';
import { GameStatus, PaddlePos, PowerUpEvent, Results } from "../../models/pong.models";
import { PongService } from '../../services/pong.service';
import { GamechatComponent } from './gamechat/gamechat.component';
import { Paddle, Ball, PowerUp } from './entities';
// enum KeyBindings{
//   UP = 38,
//   DOWN = 40
// }

@Component({
  selector: 'app-pong',
  templateUrl: './pong.component.html',
  styleUrls: ['./pong.component.scss'],
  providers: [PongService, GamechatComponent]
})
export class PongComponent implements AfterViewInit {
  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    if (event.key != "ArrowUp" && event.key != "ArrowDown")
      return;
    if(event.key == "ArrowUp"){
      PlayingPongMatch.upIsPressed = true;
    }else if (event.key == "ArrowDown"){
      PlayingPongMatch.downIsPressed = true;
    }
    if (this.game instanceof PlayingPongMatch) {
      this.game.update_direction();
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    if (event.key != "ArrowUp" && event.key != "ArrowDown")
      return;
    if(event.key == "ArrowUp"){
      PlayingPongMatch.upIsPressed = false;
    }else if (event.key == "ArrowDown"){
      PlayingPongMatch.downIsPressed = false;
    }
    if (this.game instanceof PlayingPongMatch) {
      this.game.update_direction();
    }
  }
  @ViewChild('canvas')
  gameCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('readyButton')
  readyButton!: ElementRef<HTMLButtonElement>;

  private game!: PongMatch;

  players: any[] = [
    {name: "adesvall", imgUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Head_Odysseus_MAR_Sperlonga.jpg", ratio: "51V / 52"},
    {name: "upeyret", imgUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Head_Odysseus_MAR_Sperlonga.jpg", ratio: "19V / 43"}
  ];

  constructor(private route: ActivatedRoute, private pongService: PongService) {
    this.pongService.specModeEvent.subscribe(() => {
      console.log("spec mode");
      this.game = new PongMatch(this.route, this.pongService, this.gameCanvas);
    });
  }
  
  ngAfterViewInit(): void {
    this.game = new PlayingPongMatch(this.route, this.pongService, this.gameCanvas);
  }

  ready() {
    this.game.ready();
    this.readyButton.nativeElement.disabled = true;
  }
}

export class PongMatch {

  private gameContext!: CanvasRenderingContext2D;

  public playerScore: number = 0;
  public opponentScore: number = 0;
  private wallOffset: number = 20;
  protected player!: Paddle;
  private opponentPlayer!: Paddle;
  private ball!: Ball;
  private powerUps: PowerUp[] = [];
  private cur!: number; //lastupdate time
  private gameId!: number;
  specSubcription: Subscription;
  otherSubcriptions: Subscription[] = [];
  idInterval!: any;
  
  constructor(private route: ActivatedRoute, protected wss: PongService, private gameCanvas: ElementRef<HTMLCanvasElement>) {
    console.log("ngAfterViewInit");
    this.gameContext = <CanvasRenderingContext2D> this.gameCanvas.nativeElement.getContext("2d");
    this.gameContext.strokeStyle = "#fff";
    this.gameContext.lineWidth = 5;
    this.gameContext.strokeRect(-5, this.gameCanvas.nativeElement.height / 2 - 75, this.gameCanvas.nativeElement.width+10, 150);
    this.gameContext.textAlign = "center";
    this.gameContext.textBaseline = "middle";
    this.gameContext.font = "60px Orbitron";
    this.gameContext.fillStyle = "#fff";
    this.gameContext.fillText("PONG LEGACY", this.gameCanvas.nativeElement.width / 2, this.gameCanvas.nativeElement.height / 2, 1000);
    var paddleWidth:number = 20, 
      paddleHeight:number = 120, 
      ballSize:number = 20; 
    this.playerScore = 0;
    this.opponentScore = 0;
    this.player = new Paddle(paddleWidth,paddleHeight, this.wallOffset + ballSize,this.gameCanvas.nativeElement.height / 2 - paddleHeight / 2, false); 
    this.opponentPlayer = new Paddle(paddleWidth,paddleHeight,this.gameCanvas.nativeElement.width - (this.wallOffset + paddleWidth) - ballSize,this.gameCanvas.nativeElement.height / 2 - paddleHeight / 2, false);
    this.ball = new Ball(ballSize,ballSize,this.gameCanvas.nativeElement.width / 2 - ballSize / 2, this.gameCanvas.nativeElement.width / 2 - ballSize / 2, this);
    this.gameId = +this.route.snapshot.params['gameId'];
    
    this.otherSubcriptions.push(this.wss.paddleEvent.subscribe((pad: PaddlePos)  => {
      this.opponentPlayer.y = pad.y;
      this.opponentPlayer.yVel = pad.yVel;
      console.log("Response from websocket: " + pad);
    }));
    this.otherSubcriptions.push(this.specSubcription = this.wss.myPaddleEvent.subscribe((pad: PaddlePos)  => {
      this.player.y = pad.y;
      this.player.yVel = pad.yVel;
      console.log("Response from websocket: " + pad);
    }));
    this.otherSubcriptions.push(this.wss.gameEvent.subscribe((state: GameStatus) => {
      this.playerScore = state.myScore;
      this.opponentScore = state.opponentScore;
      this.ball.x = state.ballX;
      this.ball.y = state.ballY;
      this.ball.xVel = state.ballXVel;
      this.ball.yVel = state.ballYVel;
      this.cur = state.timeStamp;
      console.log("Response from websocket: " + state);
    }));
    this.otherSubcriptions.push(this.wss.startEvent.subscribe((compteur: number) => {
      if (compteur !== 0) {
        this.gameContext.fillStyle = "#000";
        this.gameContext.fillRect(0,0,this.gameCanvas.nativeElement.width,this.gameCanvas.nativeElement.width);
        this.gameContext.fillStyle = "#fff";
        if (compteur === -1)
          this.gameContext.fillText(`Waiting for players...`, 700, 600);
        else
          this.gameContext.fillText(`${compteur}`, 700, 400);
        return;
      }
      this.start();
    }));
    this.otherSubcriptions.push(this.wss.powerUpEvent.subscribe((e: PowerUpEvent) => {
      if (e.subject === "add")
        this.powerUps.push(new PowerUp(e));
      else {
        this.powerUps = this.powerUps.filter((p) => p.x !== e.x || p.y !== e.y);
        if (e.subject === "0")
        {
          if (e.size === 0)
            this.player.endPowerUp(e.type);
          else
            this.player.powerUp(e.type);
        }
        else if (e.subject === "1")
        {
          if (e.size === 0)
            this.opponentPlayer.endPowerUp(e.type);
          else
            this.opponentPlayer.powerUp(e.type);
        }
      }
    }));
    this.otherSubcriptions.push(this.wss.endEvent.subscribe((e: Results) => {
      this.end();
      this.gameContext.fillStyle = "#000";
      this.gameContext.fillRect(0,0,this.gameCanvas.nativeElement.width,this.gameCanvas.nativeElement.height);
      this.gameContext.fillStyle = "#fff";
    this.gameContext.font = "120px Orbitron";
      if (this.playerScore > this.opponentScore)
        this.gameContext.fillText(`You win`, 700, 300);
      else
        this.gameContext.fillText(`You lose`, 700, 300);    
      this.gameContext.fillText(e.yourScore+" - "+e.opponentScore, 700, 500);    
      this.specSubcription.unsubscribe();
      this.otherSubcriptions.forEach((sub) => sub.unsubscribe());
      this.otherSubcriptions = [];
    }));
  }
  ready() {
    this.wss.sendStartGame(this.gameId);
  }
  start(): void {
    if (this.cur !== undefined) {
      return;
    }
    this.cur = Date.now();
    this.idInterval = setInterval(() => this.gameLoop(), 1000 / 120);
  }
  
  gameLoop(){
    let period = 1000 / 60;
    while (Date.now() - this.cur >= period)
    {
      this.update();
      this.cur = this.cur + period;
    }
    this.draw();
  }
  
  end(): void {
    clearInterval(this.idInterval);
  }
  
  drawBoardDetails(){
    //draw court outline
    this.gameContext.strokeStyle = "#bbb";
    this.gameContext.lineWidth = 10;
    this.gameContext.strokeRect(this.wallOffset,this.wallOffset,this.gameCanvas.nativeElement.width - 2 * this.wallOffset ,this.gameCanvas.nativeElement.height - 2 * this.wallOffset);
    //draw center lines
    this.gameContext.fillStyle = "#bbb";
    for (var i = this.wallOffset; i + 30 <= this.gameCanvas.nativeElement.height - this.wallOffset; i += 60) {
      this.gameContext.strokeRect(this.gameCanvas.nativeElement.width / 2, i, 0, 40);
    }
    //draw scores
    this.gameContext.fillStyle = "#fff";
    this.gameContext.fillText(`${this.playerScore}`, 550, 100);
    this.gameContext.fillText(`${this.opponentScore}`, 850, 100);
  }
  
  update() {
      
    this.player.update(this.gameCanvas.nativeElement, this.wallOffset);
    this.opponentPlayer.update(this.gameCanvas.nativeElement, this.wallOffset);
    this.ball.update(this.player,this.opponentPlayer,this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height, this.wallOffset);
    
  }

  draw()  {
    this.gameContext.fillStyle = "#000";
    this.gameContext.fillRect(0,0,this.gameCanvas.nativeElement.width,this.gameCanvas.nativeElement.height);
    
    this.drawBoardDetails();
    this.ball.draw(this.gameContext);
    this.player.draw(this.gameContext);
    this.opponentPlayer.draw(this.gameContext);
    for (let i = 0; i < this.powerUps.length; i++) {
      this.powerUps[i].draw(this.gameContext);
    }
  }
}

export class PlayingPongMatch extends PongMatch {
  
  public static upIsPressed: boolean = false;
  public static downIsPressed: boolean = false;

  constructor(route: ActivatedRoute, wss: PongService, gameCanvas: ElementRef<HTMLCanvasElement>) {
    super(route, wss, gameCanvas);
    this.player.setPlayer();
    this.specSubcription.unsubscribe();
  }

  update_direction() {
    this.player.update_dir();
    this.wss.sendPaddlePos(this.player.y, this.player.yVel);
  }
}
