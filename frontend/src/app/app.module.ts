import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { CookieService } from 'ngx-cookie-service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { TfaComponent } from './features/tfa/tfa.component';
import { RouterModule } from '@angular/router';
import { ChatModule } from './features/chat/chat.module';
import { PongModule } from './features/pong/pong.module';
import { LandingPageComponent } from './features/landing-page/landing-page.component';

@NgModule({
	declarations: [AppComponent, TfaComponent, LandingPageComponent],
	imports: [
		BrowserModule,
		CoreModule,
		ChatModule,
		PongModule,
		AppRoutingModule,
		HttpClientModule,
		ReactiveFormsModule,
		NgOtpInputModule,
		RouterModule
	],
	providers: [CookieService],
	bootstrap: [AppComponent]
})
export class AppModule { }