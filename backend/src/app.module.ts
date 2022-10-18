import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TwoFactorAuthenticationModule } from './2FA/twoFactorAuthentication.module';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatGameModule } from './game+chat/chatgame.module';
import { LeaderBoardModule } from './leaderboard/leaderboard.module';
import { ProfileModule } from './profile/profile.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { StreamModule } from './stream/stream.module';
import { UnsubscribeOnCloseInterceptor } from './unsubscribe-on-close.interceptor';
import { UploadsModule } from './uploads/uploads.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    ProfileModule,
    LeaderBoardModule,
    AccountModule,
    SidebarModule,
    UploadsModule,
    StreamModule,
    ChatGameModule,
    UserModule,
    TwoFactorAuthenticationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'upload'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UnsubscribeOnCloseInterceptor],
})
export class AppModule {}
