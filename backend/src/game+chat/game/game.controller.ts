import { Controller, Get, Put, Body, Param, Sse } from '@nestjs/common';
import { GameService } from './game.service';
import { GamePaddle } from './game.interface';
import { Logger } from '@nestjs/common';
import { interval, map, Observable } from 'rxjs';

@Controller('pong')
export class GameController {

  constructor (private readonly gameService: GameService){
  }

  // @Get(':gameId/:id')
  // getGameStatusById(@Param('gameId') gameId: number, @Param('id') id : number): any {
  //   return this.gameService.getGameStatus(gameId, id);    
  // }

  // @Put(':gameId/:id')
  // updateById(@Param('gameId') gameId: number, @Param('id') id : number, @Body() Paddle: GamePaddle): void {
  //   this.gameService.setPlayerPos(gameId, id, Paddle);
  //   return;
  // // }

  // @Sse('events')
  // events(@Request() req)  {
  //     return this.eventsService.subscribe();
  // }
}
