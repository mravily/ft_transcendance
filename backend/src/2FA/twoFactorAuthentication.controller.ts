import {
    ClassSerializerInterceptor,
    Controller,
    Post,
    UseInterceptors,
    Res,
    UseGuards,
    Req,
    Session,
} from '@nestjs/common';
import { IUser2FA, TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { Response } from 'express';
// import { AuthGuard } from '@nestjs/passport';
 
@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
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
}