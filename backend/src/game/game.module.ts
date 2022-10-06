import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';

import { GameGateway } from './game.gateway';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [GameController],
  providers: [GameService, GameGateway, AuthService, JwtService]
})
export class GameModule {


}
