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

  public async generateTfaSecret(user: IUser2FA) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      user.email,
      this.configService.get('APP_NAME'),
      secret,
    );

    await this.db.set2FA(user.id, secret);

    return {
      secret,
      otpauthUrl,
    };
  }

  public async getQrCodeDataUrl(otpauthUrl: string) {
    return toDataURL(otpauthUrl, (err, dataUrl) => {
      if (err) throw err;
      console.log('DEBUG: ', dataUrl);
    });
  }

  public async getQrCodeDataUrl2(otpauthUrl: string) {
    return toDataURL(otpauthUrl);
  }

  async isTfaCodeValid(tfaCode: string, user: string) {
    console.log('test code ', tfaCode);
    console.log('test user ', user);
    // const secret = '14b27644-875b-47c4-85ad-6052cf74b4a6';
    if (!user || !tfaCode) return false;
    const secret = await this.db.get2FASecret(user);
    if (secret)
      return authenticator.verify({
        token: tfaCode,
        secret: secret,
      });
    return false;
  }
}
