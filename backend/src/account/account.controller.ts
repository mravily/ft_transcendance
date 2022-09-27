import { Controller, Get, Param, Req, Session } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Controller('account')
export class AccountController {
    constructor(private db: PrismaService) {}

    @Get()
    getUserAccount(@Session() session: Record<string, any>) {
        return this.db.getUserAccount(session.login);
    }
}