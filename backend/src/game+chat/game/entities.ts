import { GameMatch } from "./game.service";

enum powerType {
  double_paddle,
  large_paddle,
  small_paddle,
  power_paddle,
  slow_paddle,
}
export class PowerUp {
  x: number;
  y: number;
  type: powerType;
  size: number = 20;

  constructor() {
    this.x = 200 + Math.floor(Math.random() * 1000);
    this.y = 100 + Math.floor(Math.random() * 600);
    this.type = Math.floor(Math.random() * 5);
  }
  collides(ball : Ball) {
    if (ball.x < this.x + this.size && ball.x + this.size > this.x
        && ball.y < this.y + this.size && ball.y + this.size > this.y) {
      return true;
    }
    return false;
  }
}
export class Entity{
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
  // draw(context: CanvasRenderingContext2D){
    // context.fillStyle = "#fff";
    // context.fillRect(this.x,this.y,this.width,this.height);
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
  private powerUps: Map<powerType, number> = new Map<powerType, number>();
  private double_paddle!: DoublePaddle;
  private coef_height: number = 1;
  public coef_force: number = 1;
  private coef_speed: number = 1;
  
  constructor(private w:number, private h:number,x:number,y:number){
    super(w,h,x,y);
  }
  
  update(canvasHeight: number, wallOffset: number, game: GameMatch): void {
    let now = Date.now();
    if (this.powerUps.has(powerType.double_paddle) && now - this.powerUps.get(powerType.double_paddle) > 10000) {
      this.powerUps.delete(powerType.double_paddle);
      this.double_paddle = undefined;
      game.sendEndofPowerUp(this.x > 700, powerType.double_paddle);
    }
    if (this.powerUps.has(powerType.large_paddle) && now - this.powerUps.get(powerType.large_paddle) > 10000) {
      this.powerUps.delete(powerType.large_paddle);
      this.coef_height = 1;
      game.sendEndofPowerUp(this.x > 700, powerType.large_paddle);
    }
    if (this.powerUps.has(powerType.small_paddle) && now - this.powerUps.get(powerType.small_paddle) > 10000) {
      this.powerUps.delete(powerType.small_paddle);
      this.coef_height = 1;
      game.sendEndofPowerUp(this.x > 700, powerType.small_paddle);
    }
    if (this.powerUps.has(powerType.power_paddle) && now - this.powerUps.get(powerType.power_paddle) > 10000) {
      this.powerUps.delete(powerType.power_paddle);
      this.coef_force = 1;
      game.sendEndofPowerUp(this.x > 700, powerType.power_paddle);
    }
    if (this.powerUps.has(powerType.slow_paddle) && now - this.powerUps.get(powerType.slow_paddle) > 10000) {
      this.powerUps.delete(powerType.slow_paddle);
      this.coef_speed = 1;
      game.sendEndofPowerUp(this.x > 700, powerType.slow_paddle);
    }
    this.height = this.h * this.coef_height;
    this.speed = this.baseSpeed * this.coef_speed;
    this.width = this.w * this.coef_force;

    if( this.yVel === -1 ){
      if(this.y + this.yVel * this.speed <= wallOffset){
        this.yVel = 0
      }
    }else if( this.yVel === 1 ){
      if(this.y + this.yVel * this.speed + this.height >= canvasHeight - wallOffset){
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
  
}

  // export class ComputerPaddle extends Entity{
    
  //   private speed:number = 5;
    
  //   constructor(w:number,h:number,x:number,y:number){
  //     super(w,h,x,y);        
  //   }
    
  //   // update(ball:Ball, canvas: HTMLCanvasElement){ 
  //   update(ball:Ball, canvasHeight: number){ 
      
  //     //chase ball
  //     if(ball.y < this.y && ball.xVel == 1){
  //         this.yVel = -1; 
          
  //         if(this.y <= 20){
  //             this.yVel = 0;
  //         }
  //     }
  //     else if(ball.y > this.y + this.height && ball.xVel == 1){
  //         this.yVel = 1;
          
  //         if(this.y + this.height >= canvasHeight - 20){
  //             this.yVel = 0;
  //         }
  //     }
  //     else{
  //         this.yVel = 0;
  //     }
      
  //     this.y += this.yVel * this.speed;
  
  //   }
    
  // }
  
export class Ball extends Entity  {
  
  private speed:number = 10;
  lastXVel: number;
  lastYVel: number;
  lastXsign: boolean;

  constructor(w:number,h:number,x:number,y:number, private pong:GameMatch){
    super(w,h,x,y);
    var randomDirection = Math.floor(Math.random() * 2) + 1; 
    if(randomDirection % 2){
      this.xVel = 1; 
    }else{
      this.xVel = -1;
    }
    this.yVel = 1;
  }
  
  update(player1: Paddle, player2: Paddle, canvasWidth:number, canvasHeight:number, wallOffset: number): void {
    //check top canvas bounds
    if(this.y <= wallOffset || this.y + this.height >= canvasHeight - wallOffset){
      this.yVel = -this.yVel;
    }
    //check players collision
    if (this.xVel < 0 && player1.collides(this)) {
      this.xVel = player1.coef_force;
      this.yVel = (this.y + this.height / 2 - player1.y - player1.height / 2) * 2 / player1.height;
    }
    if (this.xVel > 0 && player2.collides(this)) {
      this.xVel = -player2.coef_force;
      this.yVel = (this.y + this.height / 2 - player2.y - player2.height / 2) * 2 / player2.height;
    }
    //check left canvas bounds
    if(this.x <= 0) {  
      this.x = canvasWidth / 2 - this.width / 2;
      this.pong.player2Score += 1;
      this.xVel = 1;
    }
    //check right canvas bounds
    if(this.x + this.width >= canvasWidth)  {
      this.x = canvasWidth / 2 - this.width / 2;
      this.pong.player1Score += 1;
      this.xVel = -1;
    }
    
    this.x += this.xVel * this.speed;
    this.y += this.yVel * this.speed;
  }
}
