import { Body, Controller, Post, Session } from "@nestjs/common";
import { session } from "passport";
import { PrismaService } from "../prisma.service";

@Controller('user')
export class UserController {
    constructor(private db: PrismaService) {}

    @Post('friendrequest')
    async sendFriendReques(@Body() req, @Session() session: Record<string, any>) {
        await this.db.sendFriendReq(await this.db.getUserLogin(session.userid), req.login);
    }

    @Post('acceptfriend')
    async acceptFrienship(@Body() req, @Session() session: Record<string, any>) {
        await this.db.acceptFriendship(await this.db.getUserLogin(session.userid), req.login);
    }

    @Post('isuser')
    async isUser(@Body() req): Promise<boolean> {
        return await this.db.isUser(req.login);
    }
}