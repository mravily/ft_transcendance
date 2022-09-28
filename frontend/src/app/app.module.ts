import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LeaderboardModule } from './features/leaderboard/leaderboard.module';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { PongModule } from './pong/pong.module';
import { ChatModule } from './chat/chat.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
	  CoreModule,
	  LeaderboardModule,
    AppRoutingModule,
	  HttpClientModule,
    CommonModule,
    PongModule,
    ChatModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
