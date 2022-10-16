import { Controller, Get, Session } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('sidebar')
export class SidebarController {
  constructor(private db: PrismaService) {}

  @Get()
  getSidebar(@Session() session: Record<string, any>) {
    return this.db.getSidebar(session.login);
  }
}
