import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { Strategy, VerifyCallback, Profile } from 'passport-42';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly configService: ConfigService, private db: PrismaService) {
    super({
      clientID: configService.get<string>('FORTYTWO_CLIENT_ID'),
      clientSecret: configService.get<string>('FORTYTWO_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/42/return',
      passReqToCallback: true,
    });
  }

  async validate(
    request: { session: { accessToken: string } },
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
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
    this.db.setUser(profile.login, profile.name, profile.email, UserRole.User, accessToken);
    const jwt = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    const user = {
      email: profile.emails,
      username: profile.username,
    };
    console.log('accesToken', accessToken);
    console.log('user.email', user.email);
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
