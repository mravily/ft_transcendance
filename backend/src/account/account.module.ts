import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AccountController } from "./account.controller";


@Module({
    imports: [
        // JwtModule.register({
        //     secret: process.env.JWT_PRIV_KEY,
        //     signOptions: { expiresIn: '60s' },
        //   })
    ],
    controllers: [AccountController],
    providers: [PrismaService],
})
export class AccountModule {}