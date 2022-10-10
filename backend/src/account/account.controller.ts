import { Controller, Get, Session } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('account')
export class AccountController {
  constructor(private db: PrismaService) {}

  @Get()
  getUserAccount(@Session() session: Record<string, any>) {
    console.log('user.id', session.userid);
    return this.db.getUserAccount(session.userid);
  }
}
