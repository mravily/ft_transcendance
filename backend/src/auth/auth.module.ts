import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FortyTwoStrategy } from './fortyTwo.strategy';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [ConfigService, FortyTwoStrategy],
})
export class AuthModule {}
