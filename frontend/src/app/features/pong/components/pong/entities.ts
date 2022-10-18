import { PowerUpEvent } from '../../models/pong.models';
import { PlayingPongMatch, PongMatch } from './pong.component';

enum powerType {
  double_paddle,
  large_paddle,
  small_paddle,
  power_paddle,
  slow_paddle,
}
export class PowerUp {
  x: number = 0;
  y: number = 0;
  type: powerType = powerType.power_paddle;
  size: number = 20;

  static colors = ["#ff0", "#00f", "#0f0", "#f00", "#0ff"];
  constructor(e: PowerUpEvent) {
    if (e == undefined)
      return;
    this.x = e.x;
    this.y = e.y;
    this.type = e.type;
    this.size = e.size;
  }
  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = PowerUp.colors[this.type];
    context.fillRect(this.x,this.y,this.size,this.size);
  }
}
class Entity{
  width:number;
  height:number;
  x:number;
  y:number;
  xVel:number = 0;
  yVel:number = 0;
  constructor(w:number,h:number,x:number,y:number){       
    this.width = w;
    this.height = h;
    this.x = x;
    this.y = y;
  }
  draw(context: CanvasRenderingContext2D){
    context.fillStyle = "fff";
    context.fillRect(this.x,this.y,this.width,this.height);
  }
}

class DoublePaddle extends Entity {
  mainpaddle: Paddle;

  constructor(paddle: Paddle) {
    var offset = 1000;
    if (paddle.x > 700)  {
      offset = -offset;
    }
    super(paddle.width, paddle.height, paddle.x + offset, paddle.y);
    this.mainpaddle = paddle;
  }

  update() {
    this.y = this.y + (this.mainpaddle.y - this.y) * 0.1;
  }
}

export class Paddle extends Entity{
  
  private baseSpeed = 20;
  private speed:number = 20;
  private powerUps: Map<powerType, number> = new Map();
  private double_paddle!: DoublePaddle | undefined;
  private coef_height: number = 1;
  private coef_speed: number = 1;
  coef_force: number = 1;

  constructor(private w:number,private h:number,x:number,y:number, public isPlayer: boolean){
    super(w,h,x,y);
  }

  override draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = "#fff";
    context.fillRect(this.x,this.y,this.width,this.height);
    if (this.double_paddle !== undefined) {
      this.double_paddle.draw(context);
    }
    let x = 25;
    if (this.x > 700) {
      x = 1400 - 33;
    }
    let i = 25;
    for (let v of this.powerUps.entries())  {
      context.fillStyle = PowerUp.colors[v[0]];
      let width = (v[1] + 10000 - Date.now()) * 10 / 1000;
      context.fillRect(x, i, 7, width);
      i += width + 5;
    }    
  }
  update_dir()  {
    let dir = -(PlayingPongMatch.upIsPressed?1:0) + (PlayingPongMatch.downIsPressed?1:0);
    this.yVel = dir;
  }
  
  update(canvas: HTMLCanvasElement, wallOffset: number) {
    this.height = this.h * this.coef_height;
    this.speed = this.baseSpeed * this.coef_speed;
    this.width = this.w * this.coef_force;

    if (this.isPlayer)
      this.update_dir();
    
    if( this.yVel == -1 ){
      if(this.y + this.yVel * this.speed <= wallOffset){
        this.yVel = 0
      }
    }else if( this.yVel == 1 ){
      if(this.y + this.yVel * this.speed + this.height >= canvas.height - wallOffset){
        this.yVel = 0;
      }
    }
    if (this.double_paddle !== undefined) {
      this.double_paddle.update();
    }
    
    this.y += this.yVel * this.speed;
  }
  collides(ball: Ball): boolean {
    if (this.double_paddle !== undefined
      && ball.x + ball.width > this.double_paddle.x && ball.x < this.double_paddle.x + this.double_paddle.width
      && ball.y + ball.height > this.double_paddle.y && ball.y < this.double_paddle.y + this.double_paddle.height)
      return true;

    return ball.x + ball.width > this.x && ball.x < this.x + this.width
        && ball.y + ball.height > this.y && ball.y < this.y + this.height;
  }
  powerUp(type: powerType) {
    switch (type) {
      case powerType.double_paddle:
        this.double_paddle = new DoublePaddle(this);
        break;
      case powerType.large_paddle:
        this.coef_height = 1.5;
        break;
      case powerType.small_paddle:
        this.coef_height = 0.75;
        break;
      case powerType.power_paddle:
        this.coef_force = 1.5;
        break;
      case powerType.slow_paddle:
        this.coef_speed = 0.66;
        break;
      default:
        return;
    }
    this.powerUps.set(type, Date.now());
  }
  endPowerUp(type: powerType) {
    switch (type) {
      case powerType.double_paddle:
        this.double_paddle = undefined;
        break;
      case powerType.large_paddle:
        this.coef_height = 1;
        break;
      case powerType.small_paddle:
        this.coef_height = 1;
        break;
      case powerType.power_paddle:
        this.coef_force = 1;
        break;
      case powerType.slow_paddle:
        this.coef_speed = 1;
        break;
      default:
        return;
    }
    this.powerUps.delete(type);
  }
}

export class Ball extends Entity{
  
  private speed:number = 10;
  
  constructor(w:number,h:number,x:number,y:number, private pong: PongMatch){
    super(w,h,x,y);
  }
  
  update(player: Paddle, opponentPlayer: Paddle, canvasWidth:number, canvasHeight:number, wallOffset: number){
    //check top canvas bounds
    if(this.y <= wallOffset || this.y + this.height >= canvasHeight - wallOffset){
        this.yVel = -this.yVel;
    }    
    // //check left canvas bounds
    // if(this.x <= wallOffset)  {  
    //     this.x = canvasWidth / 2 - this.width / 2;
    //     this.pong.opponentScore += 1;
    //   this.xVel = 1;
    // }    
    // //check right canvas bounds
    // if(this.x + this.width >= canvasWidth - wallOffset) {
    //     this.x = canvasWidth / 2 - this.width / 2;
    //     this.pong.playerScore += 1;
    //     this.xVel = -1;
    // }
    //check players collision
    if (this.xVel < 0 && player.collides(this)) {
      this.xVel = player.coef_force;
      this.yVel = (this.y + this.height / 2 - player.y - player.height / 2) * 2 / player.height;
    }
    if (this.xVel > 0 && opponentPlayer.collides(this)) {
      this.xVel = -opponentPlayer.coef_force;
      this.yVel = (this.y + this.height / 2 - opponentPlayer.y - opponentPlayer.height / 2) * 2 / opponentPlayer.height;
    }

    // if(this.x <= player.x + player.width){
    //     if(this.y >= player.y && this.y + this.height <= player.y + player.height){
    //         this.xVel = 1;
    //     }
    // }
    // //check opponentPlayer collision
    // if(this.x + this.width >= opponentPlayer.x){
    //     if(this.y >= opponentPlayer.y && this.y + this.height <= opponentPlayer.y + opponentPlayer.height){
    //         this.xVel = -1;
    //     }
    // }
    
    this.x += this.xVel * this.speed;
    this.y += this.yVel * this.speed;
  }

}
