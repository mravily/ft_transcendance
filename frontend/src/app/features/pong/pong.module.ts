import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppComponent } from '../../app.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PongComponent } from './components/pong/pong.component';
import { HttpClientModule } from '@angular/common/http';
import { GamechatComponent } from './components/gamechat/gamechat.component';
// import { httpInterceptorProviders } from '../interceptors';
// import { ChatComponent } from './chat/chat.component';
// import { NewroomComponent } from './chat/newroom/newroom.component';

@NgModule({
	declarations: [
		LobbyComponent,
		PongComponent,
		GamechatComponent,
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		BrowserModule,
		CommonModule,
	],
	providers: [
		{ provide: LOCALE_ID, useValue: 'fr-FR' },
		// httpInterceptorProviders
	],
	exports: [
		LobbyComponent,
		PongComponent,
	],
})
export class PongModule {
}
