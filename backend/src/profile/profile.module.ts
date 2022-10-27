import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../auth/auth.service";
import { PrismaService } from "../prisma.service";
import { ProfileController } from "./profile.controller";
import { ProfileGateway } from "./profile.gateway";

@Module({
    imports: [],
    controllers: [ProfileController],
    providers: [PrismaService, ProfileGateway, AuthService, JwtService],
})
export class ProfileModule {}