import {
  Controller,
  Param,
  Post,
  Session,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '../prisma.service';
// import { diskStorage } from 'multer';

// export const storage = {
//   storage: diskStorage({
//       destination: './upload',
      // filename: (req, file, cb) => {
      //     const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      //     const extension: string = path.parse(file.originalname).ext;

      //     cb(null, `${filename}${extension}`)
      // }
//   })

// }

@Controller('upload')
export class UploadsController {
  constructor(private db: PrismaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Session() session: Record<string, any>,
  ) {
    this.db.uploadPhoto(session.userid, file);
    console.log(file);
    return file;
  }
}
