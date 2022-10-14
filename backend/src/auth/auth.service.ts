import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { Tokens } from './types/tokens.type';
// import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private db: PrismaService) {}

  async getTokens(userId: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          expiresIn: '900s',
          secret: process.env.ACCESS_SECRET,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          expiresIn: '7d',
          secret: process.env.RT_SECRET,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  // hashData(data: string) {
  //   // return argon2.hash(data);
  // }

  //   async updateRefreshToken(userId: string, refreshToken: string) {
  //     const hashedRefreshToken = await this.hashData(refreshToken);
  //     // await Update le RefreshToken dans le model User
  //   }

  //   async refreshTokens(userId: string, refreshToken: string) {
  //     const user = await this.db.getUser(userId);
  //     if (!user || !user.rtoken) throw new ForbiddenException('Access Denied');
  //     const refreshTokenMatches = await argon2.verify(user.rtoken, refreshToken);
  //     if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
  //     const tokens = await this.getTokens(userId);
  //     await this.updateRefreshToken(user.id, tokens.refresh_token);
  //     return tokens;
  //   }
}
