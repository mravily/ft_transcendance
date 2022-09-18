import { Injectable, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { Strategy, VerifyCallback, Profile } from 'passport-42';
import { ExtractJwt } from 'passport-jwt';
import { PrismaService } from '../prisma.service';
import { jwtConstants } from './constant';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly configService: ConfigService,
    private db: PrismaService,
    private jwtService: JwtService,
  ) {
    super({
      clientID: configService.get<string>('FORTYTWO_CLIENT_ID'),
      clientSecret: configService.get<string>('FORTYTWO_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/42/return',
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(
    request: { session: { accessToken: string; jwt: string } },
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
    @Res() res,
  ): Promise<any> {
    request.session.accessToken = accessToken;
    console.log(
      'accessToken',
      accessToken,
      'refreshToken',
      refreshToken,
      'profile',
      profile,
    );

    this.db.setUser(
      profile.username,
      profile.displayName,
      profile.emails[0].value,
      UserRole.User,
      accessToken,
    );

    type PayloadType = {
      login: string;
    };

    const payload = { login: profile.username };
    const jwt = this.jwtService.sign(payload);
	request.session.jwt = jwt;
    console.log('myatoken', jwt);
    const decodeJwt = this.jwtService.decode(jwt) as PayloadType;
    console.log('decode', decodeJwt.login);
    // res.redirect('http://localhost:4200/' + jwt);
    return cb(null, profile);
  }
}

// accessToken 8c320b27a870db5c998d483325a948c9ce2c59db121b8588eb7f2d8640345ef3
// refreshToken 89af29de5a8d34ae0c7a0cdda719e8731ce2685a0660e9c579b3f270bfa835a2
// profile {
// 	username: 'mravily',
// 	displayName: 'Medhi Ravily',
// 	name: { familyName: 'Ravily', givenName: 'Medhi' },
// 	profileUrl: 'https://api.intra.42.fr/v2/users/mravily',
// 	emails: [ { value: 'mravily@student.42.fr' } ],
// 	photos: [ { value: 'https://cdn.intra.42.fr/users/mravily.jpg' } ],
// }
