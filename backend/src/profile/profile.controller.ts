import { Body, Controller, Get, Param, Post, Session } from "@nestjs/common";
import { IAccount } from "../interfaces";
import { PrismaService } from "../prisma.service";

@Controller('profile')
export class ProfileController {
  constructor(private db: PrismaService) {}

  @Post('update')
  async updateProfile(
    @Session() session: Record<string, any>,
    @Body() account: IAccount,
  ) {
    await this.db.updateUserAccount(session.userid, account);
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
