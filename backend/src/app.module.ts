import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { LeaderBoardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [AuthModule, LeaderBoardModule, GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
