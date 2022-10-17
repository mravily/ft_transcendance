import { Module } from '@nestjs/common';
import { FortyTwoStrategy } from './fortyTwo.strategy';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [FortyTwoStrategy, PrismaService, AuthService],
  exports: [PrismaService, AuthService],
})
export class AuthModule {}
