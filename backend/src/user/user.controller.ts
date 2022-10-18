import { Body, Controller, Post, Session } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('user')
export class UserController {
  constructor(private db: PrismaService) {}

  @Post('friendrequest')
  async sendFriendReques(@Body() req, @Session() session: Record<string, any>) {
    console.log('in-friend-req', req);
    await this.db.sendFriendReq(
      await this.db.getUserLogin(session.userid),
      req.login,
    );
  }

  @Post('acceptfriend')
  async acceptFrienship(@Body() req, @Session() session: Record<string, any>) {
    console.log('in-accept', req);
    await this.db.acceptFriendship(
      await this.db.getUserLogin(session.userid),
      req.login,
    );
  }

  @Post('deletefriend')
  async deleteFriend(@Body() bod, @Session() session: Record<string, any>) {
    console.log('in-delete', bod);
    await this.db.deleteFriend(session.userid, bod.login);
  }

  @Post('block')
  async blockUser(@Body() bod, @Session() session: Record<string, any>) {
    console.log('in-block', bod);
    await this.db.setBlockUser(session.userid, bod.login);
  }

  @Post('unblock')
  async unblockUser(@Body() bod, @Session() session: Record<string, any>) {
    console.log('in-unblock', bod);
    await this.db.deleteBlockUser(session.userid, bod.login);
  }

  @Post('isuser')
  async isUser(@Body() req): Promise<boolean> {
    return await this.db.isUser(req.login);
  }
}
