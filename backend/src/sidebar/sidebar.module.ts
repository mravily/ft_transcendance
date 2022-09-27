import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { SidebarController } from "./sidebar.controller";

@Module({
    imports: [],
    controllers: [SidebarController],
    providers: [PrismaService],
})
export class SidebarModule {}