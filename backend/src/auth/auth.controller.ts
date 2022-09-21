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
    const jwt = req.session.jwt;
    res.cookie('token', jwt, {
      maxAge: 60000, // Lifetime
    });
    return { url: process.env.FRONT_URL };
  }
}
