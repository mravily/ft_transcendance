import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IAccount } from '../interfaces';
import { PrismaService } from '../prisma.service';

@Controller('profile')
export class ProfileController {
  constructor(private db: PrismaService) {}

  @Post('update')
//   @UseGuards(AuthGuard('42'))
  async updateProfile(
    @Session() session: Record<string, any>,
    @Body() account: IAccount,
  ) {
    await this.db.updateUserAccount(session.userid, account);
  }

  @Get('private')
//   @UseGuards(AuthGuard('42'))
  getProfile(@Session() session: Record<string, any>) {
    return this.db.getUserProfile(session.userid);
  }

  @Get('overview')
  @UseGuards(AuthGuard('42'))
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
