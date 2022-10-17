import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma.service';

@Controller('sidebar')
export class SidebarController {
  constructor(private db: PrismaService) {}

  @Get()
//   @UseGuards(AuthGuard('42'))
  getSidebar(@Session() session: Record<string, any>) {
    return this.db.getSidebar(session.userid);
  }
}
