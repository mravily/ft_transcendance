import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { PrismaService } from '../prisma.service';
import { toDataURL } from 'qrcode';

export interface IUser2FA {
  id: string;
  email: string;
  secret: string;
}

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private db: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  public async generateTfaSecret(user: string) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      await this.db.getUserEmail(user),
      this.configService.get('APP_NAME'),
      secret,
    );

    return {
      secret,
      otpauthUrl,
    };
  }

  public async getQrCodeDataUrl(otpauthUrl: string) {
    return toDataURL(otpauthUrl, (err, dataUrl) => {
      if (err) throw err;
      //console.log('DEBUG: ', dataUrl);
    });
  }

  public async getQrCodeDataUrl2(otpauthUrl: string) {
    return toDataURL(otpauthUrl);
  }

  async isTfaCodeValid(tfaCode: string, user: string) {
    const secret = await this.db.get2FASecret(user);
    if (secret)
      return authenticator.verify({
        token: tfaCode,
        secret: secret.secret,
      });
    return false;
  }
}
