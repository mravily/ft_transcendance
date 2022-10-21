import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('account')
export class AccountController {
  constructor(private db: PrismaService) {}

  @Get()
  getUserAccount(@Session() session: Record<string, any>) {
    //console.log(session.userid);
    return this.db.getUserAccount(session.userid);
  }
}
