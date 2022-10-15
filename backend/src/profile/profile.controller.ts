import { Body, Controller, Get, Param, Post, Req, Session } from "@nestjs/common";
import { IAccount } from "../interfaces";
import { PrismaService } from "../prisma.service";
import { Request } from "@nestjs/common";

@Controller('profile')
export class ProfileController {
  constructor(private db: PrismaService) {}

    @Post('update')
    async updateProfile(@Session() session: Record<string, any>, @Body() account: IAccount) {
        console.log(account);
		await this.db.updateUserAccount(session.userid, account);
    }

	@Get(':id')
	  getPublicProfile(@Param('id') login: string) {
    return this.db.getPublicProfile(login);
	}

	@Get('private')
	getProfile(@Session() session: Record<string, any>) {
		return this.db.getUserProfile(session.userid);
	}

	@Get('overview')
	getOverview(@Session() session: Record<string, any>) {
		return this.db.getProfileOverview(session.userid);
	}
}