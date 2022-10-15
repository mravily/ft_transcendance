import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('42')
  @UseGuards(AuthGuard('42'))
  fortyTwoAuth() {
    return;
  }

  @Get('42/return')
  @UseGuards(AuthGuard('42'))
  @Redirect('/')
  fortyTwoAuthRedirect(@Res() res, @Req() req) {
    res.cookie('token', req.session.jwt, { maxAge: 9000000000 });
    return { url: process.env.FRONT_URL };
  }
}
