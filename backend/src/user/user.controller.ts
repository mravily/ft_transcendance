import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma.service';

@Controller('user')
export class UserController {
  constructor(private db: PrismaService) {}

  @Post('friendrequest')
//   @UseGuards(AuthGuard('42'))
  async sendFriendReques(@Body() req, @Session() session: Record<string, any>) {
    await this.db.sendFriendReq(
      await this.db.getUserLogin(session.userid),
      req.login,
    );
  }

  @Post('acceptfriend')
//   @UseGuards(AuthGuard('42'))
  async acceptFrienship(@Body() req, @Session() session: Record<string, any>) {
    await this.db.acceptFriendship(
      await this.db.getUserLogin(session.userid),
      req.login,
    );
  }

  @Post('block')
//   @UseGuards(AuthGuard('42'))
  async blockUser(@Body() bod, @Session() session: Record<string, any>) {
    await this.db.setBlockUser(session.userid, bod.login);
  }

  @Post('unblock')
//   @UseGuards(AuthGuard('42'))
  async unblockUser(@Body() bod, @Session() session: Record<string, any>) {
    await this.db.deleteBlockUser(session.userid, bod.login);
  }

  @Post('isuser')
  async isUser(@Body() req): Promise<boolean> {
    return await this.db.isUser(req.login);
  }
}
