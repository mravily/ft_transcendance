import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TwoFactorAuthenticationModule } from './2FA/twoFactorAuthentication.module';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
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
    TwoFactorAuthenticationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'upload'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
