import {
    ClassSerializerInterceptor,
    Controller,
    Post,
    UseInterceptors,
    Res,
    UseGuards,
    Req,
    Session,
    Get,
} from '@nestjs/common';
import { IUser2FA, TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { Response } from 'express';
import { PrismaService } from '../prisma.service';
import { IAccount } from 'src/prisma/interfaces';
import { delete2FA } from 'src/prisma/user.service';
// import { AuthGuard } from '@nestjs/passport';
 
@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private db: PrismaService,
  ) {}
 
  @Post('generate')
//   @UseGuards(AuthGuard('42'))
  async register(@Res() response: Response, @Session() session: Record<string, any>, @Req() req) {
    let user = {} as IUser2FA;
    console.log(session.userid);
    user.id = session.userid;
    user.email = req.email;
    const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(user);
 
    return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
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