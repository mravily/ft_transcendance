import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ProfileController } from "./profile.controller";

@Module({
    imports: [],
    controllers: [ProfileController],
    providers: [PrismaService],
})
export class ProfileModule {}