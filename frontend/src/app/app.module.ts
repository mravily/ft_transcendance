import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { CookieService } from 'ngx-cookie-service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from  'ng-otp-input';
import { TfaComponent } from './features/tfa/tfa.component';

@NgModule({
  declarations: [AppComponent, TfaComponent],
  imports: [
    BrowserModule,
	CoreModule,
    AppRoutingModule,
	HttpClientModule,
	ReactiveFormsModule,
	NgOtpInputModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }