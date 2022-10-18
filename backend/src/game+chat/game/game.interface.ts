export interface GameStatus {
    title?: string;
    nameP1?:string;
    nameP2?:string;
    isGameRunning?:boolean;

    timeStamp: number;
    myScore:number;
    opponentScore:number;
    ballX:number;
    ballY:number;
    ballXVel:number;
    ballYVel:number;
}
export interface GamePaddle {
    timeStamp: number;
    y: number;
    yVel: number;
}

export interface PowerUpEvent {
    subject: string;
    x: number;
    y: number;
    type: number;
    size: number;
}