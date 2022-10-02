import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';

export class User {
  login!: string;
  email!: string;
}

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(private readonly prismaService: PrismaService) {}

  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      user.email,
      process.env.APP_NAME,
      secret,
    );

    await this.prismaService.set2FA(user.login, secret);

    return {
      secret,
      otpauthUrl,
    };
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }
}
