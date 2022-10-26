import { Paddle, Ball, PowerUp } from './entities';
import { GameStatus, PaddlePos, PowerUpEvent, Results } from "../../models/pong.models";
import { PongService } from '../../services/pong.service';
import { Subscription } from 'rxjs';
import { ElementRef } from '@angular/core';

export class PongMatch {
    private isRunning = false;
    private gameContext!: CanvasRenderingContext2D;
    private period = 1000 / 60;
    public playerScore: number = 0;
    public opponentScore: number = 0;
    private wallOffset: number = 20;
    protected player!: Paddle;
    private opponentPlayer!: Paddle;
    private ball!: Ball;
    private powerUps: PowerUp[] = [];
    protected cur!: number; //lastupdate time
    // specSubcription: Subscription;
    otherSubcriptions: Subscription[] = [];
    idInterval!: any;
    private clockdiff: number = 0;
    private clockdifftab: number[] = [];

    constructor(public gameId: number, protected wss: PongService, private gameCanvas: ElementRef<HTMLCanvasElement>) {
        console.log("ngAfterViewInit");
        this.gameContext = <CanvasRenderingContext2D>this.gameCanvas.nativeElement.getContext("2d");
        this.gameContext.strokeStyle = "#fff";
        this.gameContext.lineWidth = 5;
        this.gameContext.strokeRect(-5, this.gameCanvas.nativeElement.height / 2 - 75, this.gameCanvas.nativeElement.width + 10, 150);
        this.gameContext.textAlign = "center";
        this.gameContext.textBaseline = "middle";
        this.gameContext.font = "60px Orbitron";
        this.gameContext.fillStyle = "#fff";
        this.gameContext.fillText("PONG LEGACY", this.gameCanvas.nativeElement.width / 2, this.gameCanvas.nativeElement.height / 2, 1000);
        var paddleWidth: number = 20,
            paddleHeight: number = 120,
            ballSize: number = 20;
        this.playerScore = 0;
        this.opponentScore = 0;
        this.player = new Paddle(paddleWidth, paddleHeight, this.wallOffset + ballSize, this.gameCanvas.nativeElement.height / 2 - paddleHeight / 2, true);
        this.opponentPlayer = new Paddle(paddleWidth, paddleHeight, this.gameCanvas.nativeElement.width - (this.wallOffset + paddleWidth) - ballSize, this.gameCanvas.nativeElement.height / 2 - paddleHeight / 2, false);
        this.ball = new Ball(ballSize, ballSize, this.gameCanvas.nativeElement.width / 2 - ballSize / 2, this.gameCanvas.nativeElement.width / 2 - ballSize / 2, this);

        // qd le joueur de droite fait quelque chose
        this.otherSubcriptions.push(this.wss.paddleEvent.subscribe((pad: PaddlePos) => {
            this.opponentPlayer.y = pad.y;
            this.opponentPlayer.yVel = pad.yVel;

            while (pad.yVel != 0 && pad.timeStamp + this.period <= this.cur) {
                this.opponentPlayer.update(this.gameCanvas.nativeElement, this.wallOffset);
                pad.timeStamp += this.period;
            }
        }));
        // qd la balle fait quelquechose
        this.otherSubcriptions.push(this.wss.gameEvent.subscribe((state: GameStatus) => {
            this.playerScore = state.myScore;
            this.opponentScore = state.opponentScore;
            this.ball.x = state.ballX;
            this.ball.y = state.ballY;
            this.ball.xVel = state.ballXVel;
            this.ball.yVel = state.ballYVel;

            while (state.timeStamp + this.period <= this.cur) {
                this.ball.update(this.player, this.opponentPlayer, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height, this.wallOffset);
                state.timeStamp += this.period;
            }
        }));
        // qd le jeu va commencer
        this.otherSubcriptions.push(this.wss.startEvent.subscribe((compteur: number) => {
            if (compteur == 5) {
                this.clockdiff = this.wss.sendSync();
            }
            if (compteur !== 0) {
                this.gameContext.fillStyle = "#000";
                this.gameContext.fillRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.width);
                this.gameContext.fillStyle = "#fff";
                if (compteur === -1)
                    this.gameContext.fillText(`Waiting for players...`, 700, 600);
                else
                    this.gameContext.fillText(`${compteur}`, 700, 400);
                return;
            }
            this.start();
        }));
        // qd un powerUp apparait ou disparait
        this.otherSubcriptions.push(this.wss.powerUpEvent.subscribe((e: PowerUpEvent) => {
            if (e == undefined)
                return;
            if (e.subject === "add")
                this.powerUps.push(new PowerUp(e));
            else {
                this.powerUps = this.powerUps.filter((p) => p.x !== e.x || p.y !== e.y);
                if (e.subject === "0") {
                    if (e.size === 0)
                        this.player.endPowerUp(e.type);
                    else
                        this.player.powerUp(e.type);
                }
                else if (e.subject === "1") {
                    if (e.size === 0)
                        this.opponentPlayer.endPowerUp(e.type);
                    else
                        this.opponentPlayer.powerUp(e.type);
                }
            }
        }));
        // qd le jeu est fini
        this.otherSubcriptions.push(this.wss.endEvent.subscribe((e: Results) => {
            this.end();
            this.gameContext.fillStyle = "#000";
            this.gameContext.fillRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
            this.gameContext.fillStyle = "#fff";
            this.gameContext.font = "120px Orbitron";
            if (this.player.isPlayer) {
                if (e.yourScore > e.opponentScore)
                    this.gameContext.fillText(`You win`, 700, 300);
                else
                    this.gameContext.fillText(`You lose`, 700, 300);
            }

            this.gameContext.fillText(e.yourScore + " - " + e.opponentScore, 700, 500);
            this.otherSubcriptions.forEach((sub) => sub.unsubscribe());
            this.otherSubcriptions = [];
        }));
        this.otherSubcriptions.push(this.wss.syncEvent.subscribe((servertime: number) => {
            let t = Date.now();
            // console.log('1', this.clockdiff, '2', servertime, '3', t);
            // console.log('servertime attendu', (this.clockdiff + t) / 2, 'latency aller retour', (t - this.clockdiff) / 2);
            this.clockdiff = servertime - (this.clockdiff + t) / 2;
            // console.log('difference', this.clockdiff);
            this.clockdifftab.push(this.clockdiff);

            if (this.clockdifftab.length < 7) {
                this.clockdiff = this.wss.sendSync();
            }
            else {
                // console.log(this.clockdifftab);
                this.clockdifftab.sort();
                this.clockdiff = this.clockdifftab[3];
                console.log('clockdiff median', this.clockdiff);
            }
        }));
    }
    ready() {
        this.wss.sendStartGame(this.gameId);
    }
    start(): void {
        if (this.isRunning == true) return;
        this.isRunning = true;
        if (this.cur !== undefined) {
            return;
        }
        this.cur = this.myNow();
        this.idInterval = setInterval(() => this.gameLoop(), 1000 / 62);
    }
    myNow() {
        return Date.now() + this.clockdiff;
    }

    gameLoop() {
        if (this.isRunning == false) {
            clearInterval(this.idInterval);
            return;
        };
        while (this.myNow() - this.cur >= this.period) {
            this.update();
            this.cur += this.period;
        }
        this.draw();
    }

    end(): void {
        this.isRunning = false;
        clearInterval(this.idInterval);
        this.otherSubcriptions.forEach((sub) => sub.unsubscribe());
    }

    drawBoardDetails() {
        //draw court outline
        this.gameContext.strokeStyle = "#bbb";
        this.gameContext.lineWidth = 10;
        this.gameContext.strokeRect(this.wallOffset -5, this.wallOffset -5, this.gameCanvas.nativeElement.width - 2 * this.wallOffset +5, this.gameCanvas.nativeElement.height - 2 * this.wallOffset +5);
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
        this.ball.update(this.player, this.opponentPlayer, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height, this.wallOffset);

    }

    draw() {
        this.gameContext.fillStyle = "#000";
        this.gameContext.fillRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);

        this.drawBoardDetails();
        this.ball.draw(this.gameContext);
        this.player.draw(this.gameContext);
        this.opponentPlayer.draw(this.gameContext);
        for (let i = 0; i < this.powerUps.length; i++) {
            this.powerUps[i].draw(this.gameContext);
        }
    }

    public static upIsPressed: boolean = false;
    public static downIsPressed: boolean = false;

    turnOnSpecMode() {
        this.player.isPlayer = false;
        this.otherSubcriptions.push(
            this.wss.myPaddleEvent.subscribe((pad: PaddlePos) => {
                this.player.y = pad.y;
                this.player.yVel = pad.yVel;

                while (pad.yVel != 0 && pad.timeStamp <= this.cur) {
                    this.player.update(this.gameCanvas.nativeElement, this.wallOffset);
                    pad.timeStamp += this.period;
                }
            })
        );
    }

    update_direction() {
        if (!this.player.isPlayer)
            return;
        this.player.update_dir();
        this.wss.sendPaddlePos(this.player.y, this.player.yVel, this.cur);
    }
}
