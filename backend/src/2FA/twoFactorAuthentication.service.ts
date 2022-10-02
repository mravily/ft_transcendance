import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { PrismaService } from '../prisma.service';
import { toFileStream } from 'qrcode';
 
export interface IUser2FA {
    id: string,
    email: string,
}

@Injectable()
export class TwoFactorAuthenticationService {
  constructor (
    private db: PrismaService,
    private readonly configService: ConfigService
    ) {}
 
  public async generateTwoFactorAuthenticationSecret(user: IUser2FA) {
    const secret = authenticator.generateSecret();
 
    const otpauthUrl = authenticator.keyuri(user.email, this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'), secret);
 
    await this.db.set2FA(user.id, secret);
 
    return {
      secret,
      otpauthUrl
    }
  }

  public async pipeQrCodeStream(stream, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }
}