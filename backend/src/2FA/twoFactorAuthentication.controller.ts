import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Res,
  Req,
  Session,
  UnauthorizedException,
  HttpCode,
  Body,
  Get,
  Redirect,
} from '@nestjs/common';
import {
  IUser2FA,
  TwoFactorAuthenticationService,
} from './twoFactorAuthentication.service';
import { response, Response } from 'express';
import TwoFactorAuthenticationDto from './dto/2fa.dto';
import { toDataURL } from 'qrcode';
import { PrismaService } from '../prisma.service';
import { request } from 'http';
import { IAccount } from 'src/prisma/interfaces';

@Controller('tfa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly tfaService: TwoFactorAuthenticationService,
    private db: PrismaService,
  ) {}

  @Post('generate')
  //   @UseGuards(AuthGuard('42'))
  async register(
    @Res() response: Response,
    @Session() session: Record<string, any>,
    @Req() req,
  ) {
    console.log('user.id.tfa', session.userid);
    // console.log('user.email.tfa', req.email);
    const user = {} as IUser2FA;
    user.id = session.userid;
    user.email = 'mravily@student.42.fr';
    const { otpauthUrl, secret } = await this.tfaService.generateTfaSecret(
      user,
    );
    toDataURL(otpauthUrl, (err, dataUrl: string) => {
      if (err) throw err;
      return response.status(200).json({
        message: 'TFA Auth needs to be verified',
        dataUrl,
        secret: secret,
      });
    });
  }

  @Post('authenticate')
  //   @UseGuards(JwtAuthenticationGuard)
  authenticate(
    @Session() session: Record<string, any>,
    @Body() { token }: TwoFactorAuthenticationDto,
  ) {
    return this.tfaService.isTfaCodeValid(token, session.userid);
  }

  @Get('verify')
  async verify(@Session() session: Record<string, any>): Promise<boolean> {
    return this.db.is2FA(session.userid);
  }

  @Get('get2fa')
  async get2fa(@Session() session: Record<string, any>): Promise<IAccount> {
    return this.db.get2FA(session.userid);
  }

  @Post('delete')
  async delete2FA(@Session() session: Record<string, any>) {
    this.db.delete2FA(session.userid);
  }

  @Post('switch')
  async switch2fa(@Session() session: Record<string, any>) {
    this.db.switch2FA(session.userid);
  }
}
