import { Body, Controller, Post, Session } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('user')
export class UserController {
  constructor(private db: PrismaService) {}

  @Post('friendrequest')
  async sendFriendReques(@Body() req, @Session() session: Record<string, any>) {
    const login = await this.db.getUserLogin(session.userid);
    this.db.sendFriendReq(login, req.login);
  }

  @Post('acceptfriend')
  async acceptFrienship(@Body() req, @Session() session: Record<string, any>) {
    const login = await this.db.getUserLogin(session.userid);
    this.db.acceptFriendship(login, req.login);
  }

    @Post('deletefriend')
    deleteFriend(@Body() bod, @Session() session: Record<string, any>) {
        this.db.deleteFriend(session.userid, bod.login);
    }

  @Post('block')
  blockUser(@Body() bod, @Session() session: Record<string, any>) {
    this.db.setBlockUser(session.userid, bod.login);
  }

  @Post('unblock')
  unblockUser(@Body() bod, @Session() session: Record<string, any>) {
    this.db.deleteBlockUser(session.userid, bod.login);
  }

  @Post('isuser')
  isUser(@Body() req): Promise<boolean> {
    return this.db.isUser(req.login);
  }
}
