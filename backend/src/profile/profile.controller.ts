import { Controller, Get, Param, Post, Req, Session } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Request } from '@nestjs/common';

@Controller('profile')
export class ProfileController {
  constructor(private db: PrismaService) {}

  @Post('update')
  updateProfile(@Session() session: Record<string, any>, @Req() req: Request) {
    console.log(req.body);
  }

  @Get('private')
  getProfile(@Session() session: Record<string, any>) {
    return this.db.getUserProfile(session.userid);
  }

  @Get('overview')
  getOverview(@Session() session: Record<string, any>) {
    return this.db.getProfileOverview(session.userid);
  }

  @Get(':id')
  async getPublicProfile(@Param('id') login: string) {
    const isValid = await this.db.isUser(login);
    if (isValid) return this.db.getPublicProfile(login);
    return { msg: "User doesn't exist" };
  }
}
