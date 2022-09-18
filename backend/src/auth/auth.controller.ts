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
    console.log('jwt_lol', req.session.jwt);
    res.set({
      Authorization: jwt,
    });
    res.cookie('token', jwt, {
      maxAge: 60000, // Lifetime
    });
    res.redirect('http://localhost:4200');
    // else res.redirect('http://localhost:4200/');
    return;
  }
}
