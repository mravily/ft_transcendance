import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-42';
import { PrismaService } from '../prisma.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private db: PrismaService, private authService: AuthService, private jwtService: JwtService) { 
    super({
      clientID: process.env.FORTYTWO_CLIENT_ID,
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URI,
      passReqToCallback: true,
    });
    //console.log('42 strategy loaded', process.env.FORTYTWO_CLIENT_SECRET);
  }

  async validate(
    request: { session: { userid: string; jwt: any; firstTime: boolean } },
    // request: { session: { userid: string } },
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
  ): Promise<any> {
    try {
      
      request.session.firstTime = !(await this.db.isUser(profile.username));
      const id = await this.db.setUser(
        profile.username,
        profile.displayName,
        profile.name.givenName,
        profile.name.familyName,
        profile.emails[0].value,
        profile.photos[0].value,
      );
      request.session.userid = id;
      this.payload = { userid: id };
      this.jwt = this.jwtService.sign(this.payload);
      request.session.jwt = this.jwt;
      return cb(null, profile);
    } catch (err) {
      return cb(err, profile);
    }
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
