import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma.service';
import { TwoFactorAuthenticationController } from './twoFactorAuthentication.controller';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';

@Module({
  imports: [],
  controllers: [TwoFactorAuthenticationController],
  providers: [
    TwoFactorAuthenticationService,
    PrismaService,
    ConfigService,
    AuthService,
    JwtService,
  ],
})
export class TwoFactorAuthenticationModule {}
