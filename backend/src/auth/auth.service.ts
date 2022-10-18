import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private db: PrismaService) {}

  getUseridFromToken(token: string): any {
    const id = this.jwtService.decode(token);
    return id['userid'];
  }
}
