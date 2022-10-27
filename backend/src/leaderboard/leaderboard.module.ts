import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LeaderBoardController } from './leaderboard.controller';
import { LeaderboardGateway } from './leaderboard.gateway';

@Module({
  imports: [],
  // controllers: [LeaderBoardController],
  providers: [PrismaService, LeaderboardGateway],
})
export class LeaderBoardModule {}
