import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
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
    GameModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
