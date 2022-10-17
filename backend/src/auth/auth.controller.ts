import {
  Controller,
  Get,
  Redirect,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private db: PrismaService, private authService: AuthService) {}
  @Get('42')
  @UseGuards(AuthGuard('42'))
  fortyTwoAuth() {
    return;
  }

  @Get('42/return')
  @UseGuards(AuthGuard('42'))
  @Redirect('/')
  async fortyTwoAuthRedirect(@Res() res, @Req() req) {
    const tfa = await this.db.is2FA(req.session.userid).then();
    // Stocker le JWT RT dans la DB
    if (tfa == true) return { url: process.env.TFA_URL };
    const tokens = await this.authService.getTokens(req.session.userid);
    res.cookie('access', tokens.access_token, { maxAge: 900000000000000 });
    return { url: process.env.FRONT_URL };
  }

  @Get('sign-out')
  loggingOut(@Req() req, @Session() session: Record<string, any>) {
    this.db.updateUserStatus(session.userid, false);
    req.session.destroy();
  }
}
