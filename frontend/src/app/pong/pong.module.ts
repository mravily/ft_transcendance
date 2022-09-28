import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from '../app.component';
import { AppRoutingModule } from '../app-routing.module';
import { LandingPageComponent } from './components/lobby/landing-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PongComponent } from './components/pong/pong.component';
import { HttpClientModule } from '@angular/common/http';
// import { httpInterceptorProviders } from '../interceptors';
// import { GamechatComponent } from './components/pong/gamechat/gamechat.component';
// import { ChatComponent } from './chat/chat.component';
// import { NewroomComponent } from './chat/newroom/newroom.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    PongComponent,
    // GamechatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    // httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class PongModule {
}
