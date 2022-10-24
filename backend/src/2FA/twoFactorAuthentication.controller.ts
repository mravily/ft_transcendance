import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Res,
  Session,
  Body,
  Get,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { Response } from 'express';
import TwoFactorAuthenticationDto from './dto/2fa.dto';
import { toDataURL } from 'qrcode';
import { PrismaService } from '../prisma.service';
import { IAccount } from '../interfaces';
import { AuthService } from '../auth/auth.service';

@Controller('tfa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly tfaService: TwoFactorAuthenticationService,
    private db: PrismaService,
    private authService: AuthService,
  ) {}

  @Post('generate')
  async register(
    @Res() response: Response,
    @Session() session: Record<string, any>,
  ) {
    ////console.log('user.id.tfa', session.userid);
    const { otpauthUrl, secret } = await this.tfaService.generateTfaSecret(
      session.userid,
    );
    toDataURL(otpauthUrl, (err, dataUrl: string) => {
      if (err) throw err;
      this.db.set2FA(session.userid, secret, dataUrl);
      return response.status(200).json({
        dataUrl,
        secret: secret,
      });
    });
  }

  @Post('authenticate')
  async authenticate(
    @Session() session: Record<string, any>,
    @Body() { token }: TwoFactorAuthenticationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const isValid = await this.tfaService.isTfaCodeValid(token, session.userid);
    if (isValid) {
      // const tokens = await this.authService.getTokens(session.userid);
      res.cookie('access', session.userid, { maxAge: 900000000000000 });
    }
    return this.tfaService.isTfaCodeValid(token, session.userid);
  }

  @Get('verify')
  async verify(@Session() session: Record<string, any>): Promise<boolean> {
    return await this.db.is2FA(session.userid);
  }

  @Get('get2fa')
  async get2fa(@Session() session: Record<string, any>): Promise<IAccount> {
    return await this.db.get2FA(session.userid);
  }

  @Get('secret')
  get2faSecret(@Session() session: Record<string, any>): Promise<IAccount> {
    return this.db.get2FASecret(session.userid);
  }

  @Post('delete')
  delete2FA(@Session() session: Record<string, any>) {
    this.db.delete2FA(session.userid);
  }

  @Get('switch')
  async switch2fa(@Session() session: Record<string, any>) {
    await this.db.switch2FA(session.userid);
    return { msg: '2FA Status Change' };
  }

  @Get('issecret')
  async isSecret(@Session() session: Record<string, any>) {
    return await this.db.isSecret(session.userid);
  }
}
