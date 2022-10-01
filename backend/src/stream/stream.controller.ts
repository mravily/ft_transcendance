import { Controller, Get, Param, Session, StreamableFile } from "@nestjs/common";
import { createReadStream } from "fs";
import { join } from "path";
import { PrismaService } from "../prisma.service";

@Controller('stream')
export class StreamController {
    constructor(private db: PrismaService) {}

    @Get()
    async getFile(@Session() session: Record<string, any>): Promise<StreamableFile> {
        const photo = await this.db.getLastPhotoPath(session.userid);
        const file = createReadStream(join(process.cwd(), photo));
        return new StreamableFile(file);
    }
}