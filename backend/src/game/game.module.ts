import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';

import { GameGateway } from './game.gateway';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [GameController],
  providers: [GameService, GameGateway, AuthService, JwtService, PrismaService]
})
export class GameModule {


}
