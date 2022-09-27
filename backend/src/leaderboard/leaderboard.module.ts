import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { LeaderBoardController } from "./leaderboard.controller";

@Module({
    imports: [],
    controllers: [LeaderBoardController],
    providers: [PrismaService],
})
export class LeaderBoardModule {}