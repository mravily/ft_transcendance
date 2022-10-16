import { Body, Controller, Get, Param, Post, Session } from "@nestjs/common";
import { IAccount } from "../interfaces";
import { PrismaService } from "../prisma.service";

@Controller('profile')
export class ProfileController {
  constructor(private db: PrismaService) {}

    @Post('update')
    async updateProfile(@Session() session: Record<string, any>, @Body() account: IAccount) {
        // console.log(account);
		await this.db.updateUserAccount(session.userid, account);
    }

	@Get('private')
	async getProfile(@Session() session: Record<string, any>) {
		return await this.db.getUserProfile(session.userid);
	}
	
	@Get('overview')
	async getOverview(@Session() session: Record<string, any>): Promise<IAccount> {
		const tmp = await this.db.getProfileOverview(session.userid);
		console.log(tmp);
		return tmp;
	}

	@Get(':id')
	async getPublicProfile(@Param('id') login: string) {
	return await this.db.getPublicProfile(login);
	}
}