import { forwardRef, Global, Module } from '@nestjs/common';
// import { AuthModule } from 'src/auth/auth.module';
// import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat/gateway/chat.gateway';
import { PrismaService } from '../prisma.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { GameService } from './game/game.service';
import { GameGateway } from './game/game.gateway';

@Module({
  imports: [
  ],
  providers: [
    ChatGateway,
    GameGateway,
    PrismaService,
    AuthService,
    JwtService,
    GameService
  ],
})
export class ChatGameModule { }
