import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LeaderboardGateway } from './leaderboard.gateway';

@Module({
  imports: [],
  providers: [PrismaService, LeaderboardGateway],
})
export class LeaderBoardModule {}
