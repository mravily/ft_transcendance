import { Module } from '@nestjs/common';
// import { AuthModule } from 'src/auth/auth.module';
// import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './gateway/chat.gateway';
import { PrismaService } from '../prisma.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    // AuthModule, UserModule,
  ],
  providers: [ChatGateway, PrismaService, AuthService, JwtService]
})
export class ChatModule { }
