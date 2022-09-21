import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-42';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  payload!: { login: string };
  jwt!: any;

  constructor(private db: PrismaService, private jwtService: JwtService) {
    super({
      clientID: process.env.FORTYTWO_CLIENT_ID,
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URI,
      passReqToCallback: true,
    });
  }

  async validate(
    request: { session: { accessToken: string; jwt: string } },
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
  ): Promise<any> {
    request.session.accessToken = accessToken;

    this.payload = { login: profile.username };
    this.jwt = this.jwtService.sign(this.payload);
    request.session.jwt = this.jwt;

    // type PayloadType = {
    //   login: string;
    // };
    // console.log('myatoken', jwt);
    // const decodeJwt = this.jwtService.decode(jwt) as PayloadType;
    // console.log('decode', decodeJwt.login);

    this.db.setUser(
      profile.username,
      profile.displayName,
      profile.emails[0].value,
      false,
      refreshToken,
      accessToken,
      profile.photos[0].value,
    );
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