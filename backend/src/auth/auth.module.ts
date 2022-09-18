import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FortyTwoStrategy } from './fortyTwo.strategy';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [ConfigService, FortyTwoStrategy, PrismaService],
  exports: [PrismaService],
})
export class AuthModule {}
