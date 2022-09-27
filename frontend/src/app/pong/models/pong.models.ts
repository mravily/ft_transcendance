export class GameStatus {
    timeStamp!: number;
    myScore!:number;
    opponentScore!:number;
    ballX!:number;
    ballY!:number;
    ballXVel!:number;
    ballYVel!:number;
}

export interface PaddlePos {
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

export interface Results {
    yourScore: number;
    opponentScore: number;
}