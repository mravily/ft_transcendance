import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from '../prisma.service';
import { UploadsController } from './uploads.controller';

@Module({
  imports: [MulterModule.register({ dest: './upload' })],
  controllers: [UploadsController],
  providers: [PrismaService],
})
export class UploadsModule {}
