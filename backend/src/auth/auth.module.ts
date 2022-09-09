import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FortyTwoStrategy } from './fortyTwo.strategy';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AuthController],
  providers: [ConfigService, FortyTwoStrategy, PrismaService],
  exports: [PrismaService],
})
export class AuthModule {}
