import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Res,
  Session,
  Body,
  Get,
  UseGuards,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { Response } from 'express';
import TwoFactorAuthenticationDto from './dto/2fa.dto';
import { toDataURL } from 'qrcode';
import { PrismaService } from '../prisma.service';
import { IAccount } from '../interfaces';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('tfa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly tfaService: TwoFactorAuthenticationService,
    private db: PrismaService,
    private authService: AuthService,
  ) {}

  @Post('generate')
  @UseGuards(AuthGuard('42'))
  async register(
    @Res() response: Response,
    @Session() session: Record<string, any>,
  ) {
    console.log('user.id.tfa', session.userid);
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
  @UseGuards(AuthGuard('42'))
  async authenticate(
    @Session() session: Record<string, any>,
    @Body() { token }: TwoFactorAuthenticationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const isValid = await this.tfaService.isTfaCodeValid(token, session.userid);
    if (isValid) {
      const tokens = await this.authService.getTokens(session.userid);
      res.cookie('access', tokens.access_token, { maxAge: 900000000 });
    }
    return this.tfaService.isTfaCodeValid(token, session.userid);
  }

  @Get('verify')
  @UseGuards(AuthGuard('42'))
  async verify(@Session() session: Record<string, any>): Promise<boolean> {
    return await this.db.is2FA(session.userid);
  }

  @Get('get2fa')
  @UseGuards(AuthGuard('42'))
  async get2fa(@Session() session: Record<string, any>): Promise<IAccount> {
    return await this.db.get2FA(session.userid);
  }

  @Get('secret')
  @UseGuards(AuthGuard('42'))
  get2faSecret(@Session() session: Record<string, any>): Promise<IAccount> {
    return this.db.get2FASecret(session.userid);
  }

  @Post('delete')
  @UseGuards(AuthGuard('42'))
  async delete2FA(@Session() session: Record<string, any>) {
    await this.db.delete2FA(session.userid);
    return { msg: '2FA Deleted' };
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
