import { Body, Controller, Get, Param, Post, Session } from "@nestjs/common";
import { session } from "passport";
import { throwIfEmpty } from "rxjs";
import { IProfileFriends } from "src/prisma/profile.service";
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
  getProfile(@Session() session: Record<string, any>): Promise<IAccount> {
    return this.db.getUserProfile(session.userid);
  }

  @Get('overview')
  getOverview(@Session() session: Record<string, any>): Promise<IAccount> {
    return this.db.getProfileOverview(session.userid);
  }

  @Get('friends')
  getFriends(@Session() session: Record<string, any>): Promise<IProfileFriends[]> {
    return this.db.getProfileFriends(session.userid);
  }

  @Post('ismypage')
  async isMyPage(@Session() session, @Body() bod): Promise<boolean> {
    if (bod.login == await this.db.getUserLogin(session.userid))
      return true;
    return false;
  }

  @Post('isfriend')
  async isMyFriend(@Session() session, @Body() bod): Promise<boolean> {
    return await this.db.isFriend(session.userid, bod.login);
  }

  @Post('isblocked')
  async isBlocked(@Session() session, @Body() bod): Promise<boolean> {
    return await this.db.isBlocked(session.userid, bod.login);
  }

  @Get('blockedusers')
  async getBlockedUsers(@Session() session): Promise<IAccount[]> {
    return await this.db.getBlockedUsers(await this.db.getUserLogin(session.userid));
  }

  @Get(':id')
  async getPublicProfile(@Param('id') login: string) {
    const isValid = await this.db.isUser(login);
    if (isValid) return this.db.getPublicProfile(login);
    return { msg: "User doesn't exist" };
  }
}
