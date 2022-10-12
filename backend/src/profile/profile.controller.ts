import { Controller, Get, Param, Post, Req, Session } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Controller('profile')
export class ProfileController {
  constructor(private db: PrismaService) {}

    @Post('update')
    updateProfile(@Session() session: Record<string, any>, @Req() req: Request) {
        console.log(req);
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