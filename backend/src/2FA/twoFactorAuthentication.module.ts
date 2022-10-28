import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma.service';
import { TwoFactorAuthenticationController } from './twoFactorAuthentication.controller';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_SECRET,
      signOptions: { expiresIn: '60s' },
      }),
  ],
  controllers: [TwoFactorAuthenticationController],
  providers: [
    TwoFactorAuthenticationService,
    PrismaService,
    ConfigService,
    AuthService,
  ],
})
export class TwoFactorAuthenticationModule {}
