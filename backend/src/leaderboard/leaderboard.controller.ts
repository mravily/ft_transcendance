import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('leaderboard')
export class LeaderBoardController {
  constructor(private db: PrismaService) {}

  @Get()
  getLeaderBoard() {
    return this.db.getTopTen();
  }

  @Get('all')
  getAllRanking() {
    return this.db.getUsersRanking();
  }
}
