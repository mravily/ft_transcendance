import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../auth/auth.service";
import { PrismaService } from "../prisma.service";
import { SidebarGateway } from "./sidebar.gateway";

@Module({
    imports: [],
    providers: [PrismaService, SidebarGateway, AuthService, JwtService],
})
export class SidebarModule {}