import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationModule } from './2FA/twoFactorAuthentication.module';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatGameModule } from './game+chat/chatgame.module';
import { LeaderBoardModule } from './leaderboard/leaderboard.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { StreamModule } from './stream/stream.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    AuthModule,
    LeaderBoardModule,
    AccountModule,
    SidebarModule,
    UploadsModule,
    StreamModule,
    ChatGameModule,
    TwoFactorAuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
