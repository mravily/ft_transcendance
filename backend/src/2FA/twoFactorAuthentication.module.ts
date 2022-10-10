import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { TwoFactorAuthenticationController } from "./twoFactorAuthentication.controller";
import { TwoFactorAuthenticationService } from "./twoFactorAuthentication.service";

@Module({
    imports: [],
    controllers: [TwoFactorAuthenticationController],
    providers: [TwoFactorAuthenticationService, PrismaService, ConfigService]
})
export class TwoFactorAuthenticationModule {}