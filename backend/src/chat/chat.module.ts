import { Module } from '@nestjs/common';
// import { AuthModule } from 'src/auth/auth.module';
// import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './gateway/chat.gateway';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    // AuthModule, UserModule,
  ],
  providers: [ChatGateway, PrismaService, ]
})
export class ChatModule { }
