import { Module } from '@nestjs/common';
import { FortyTwoStrategy } from './fortyTwo.strategy';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_PRIV_KEY,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [FortyTwoStrategy, PrismaService],
  exports: [PrismaService],
})
export class AuthModule {}