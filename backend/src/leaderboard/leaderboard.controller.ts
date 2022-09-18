import { Controller, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Controller('leaderboard')
export class LeaderBoardController {
  constructor(private db: PrismaService) {}

  @Get()
  getLeaderBoard() {
    return this.db.getTopTen();
  }
}
