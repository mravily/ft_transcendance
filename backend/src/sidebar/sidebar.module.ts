import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../auth/auth.service";
import { PrismaService } from "../prisma.service";
import { SidebarController } from "./sidebar.controller";
import { SidebarGateway } from "./sidebar.gateway";

@Module({
    imports: [],
    // controllers: [SidebarController],
    providers: [PrismaService, SidebarGateway, AuthService, JwtService],
})
export class SidebarModule {}