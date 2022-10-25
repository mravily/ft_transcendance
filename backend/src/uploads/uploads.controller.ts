import {
  Controller,
  Post,
  Session,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '../prisma.service';

@Controller('upload')
export class UploadsController {
  constructor(private db: PrismaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Session() session: Record<string, any>) {
    // console.log(file.mimetype);
    if (file.mimetype.includes('image')){
      this.db.uploadPhoto(session.userid, file);
    }
  }
}
