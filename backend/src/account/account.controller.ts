import { Controller, Get, Session } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma.service';

@Controller('account')
export class AccountController {
  constructor(private db: PrismaService) {}

  @Get()
  // @UseGuards(AuthGuard('42'))
  getUserAccount(@Session() session: Record<string, any>) {
    console.log(session.userid);
    return this.db.getUserAccount(session.userid);
  }
}
