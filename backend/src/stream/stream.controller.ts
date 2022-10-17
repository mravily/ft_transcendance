import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import type { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { PrismaService } from '../prisma.service';

@Controller('stream')
export class StreamController {
  constructor(private db: PrismaService) {}

  @Get(':id')
  async getFile(@Param('id') id: string, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    const photo = await this.db.getLastPhoto(id);
    const file = createReadStream(join(process.cwd(), photo.path));
    res.set({
      'Content-Type': photo.mimetype,
      'Content-Disposition': 'inline',
      // 'Content-Disposition': 'form-data; name=image ; filename="' + photo.filename + '"',
    });
    // file.pipe(res);
    return new StreamableFile(file);
  }
}
