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
}