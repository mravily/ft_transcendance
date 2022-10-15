import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard, RefreshTokenGuard } from './guard/jwt-auth.guard';
import { Tokens } from './types/tokens.type';

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
    const tfa = await this.db.is2FA(req.session.userid);
    const tokens = await this.authService.getTokens(req.session.userid);
    // Stocker le JWT RT dans la DB
    res.cookie('access', tokens.access_token, { maxAge: 900000000 });
    res.cookie('refresh', tokens.refresh_token, { maxAge: 604800 });
    if (tfa == true) return { url: process.env.TFA_URL };
    console.log('at', tokens.access_token);
    return { url: process.env.FRONT_URL };
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Res() res, @Req() req) {
    const tokens = await this.authService.getTokens(req.session.userid);
    res.clearCookie('access');
    res.clearCookie('refresh');
    // Stocker le JWT RT dans la DB
    res.cookie('access', tokens.access_token, { maxAge: 90000000 });
    res.cookie('refresh', tokens.refresh_token, { maxAge: 604800 });
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  getToken(): Promise<Tokens> {
    return this.authService.getTokens('test');
  }
}

// Cookie: access=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMDVhZTI1Mi1mMTRhLTQ4NTEtOGI1Mi1mMjI0MmFkMmI3NmMiLCJpYXQiOjE2NjUyOTg0OTUsImV4cCI6MTY2NTI5OTM5NX0.WphkdfHZmOcnEq3O0ZMfrEDD0A-RZCvV38fs6opI8r0;
//  refresh=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMDVhZTI1Mi1mMTRhLTQ4NTEtOGI1Mi1mMjI0MmFkMmI3NmMiLCJpYXQiOjE2NjUyOTg0OTUsImV4cCI6MTY2NTkwMzI5NX0.CrRArJ97vVMZUzHH0ssVdLFs7kA_0VB0L1AUJLQU0jM; connect.sid=s%3AHq5jXZAYHTkhznueGLWuDtSK0wZC3QCT.yzwK6i2I4tgJu5OP2UgctzYmxyOcIzA0ZIuN0eI96xU; arp_scroll_position=0
