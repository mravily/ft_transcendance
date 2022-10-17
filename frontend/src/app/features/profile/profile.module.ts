import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileRoutingModule } from './profile.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { ProfileSecurityComponent } from './components/profile-security/profile-security.component';
import { ProfileNavBarComponent } from './components/profile-nav-bar/profile-nav-bar.component';
import { ProfileOverviewModule } from './components/profile-overview/profile-overview.module';
import { ProfileFriendsModule } from './components/profile-friends/profile-friends.module';
import { SharingModule } from 'src/app/pipe/sharing.module';
import { FriendsComponent } from './components/profile-public/friends/friends.component';
import { QrcodeViewComponent } from './components/profile-security/qrcode-view/qrcode-view.component';
import { BlocFriendPublicComponent } from './components/profile-public/friends/bloc-friends-public/bloc-friend-public.component';
import { ProfileBlockUsersModule } from './components/profile-block-users/profile-block-users.module';
import { ProfilePublicComponent } from './components/profile-public/profile-public.component';

@NgModule({
	declarations: [
		ProfileSettingsComponent,
		ProfileSecurityComponent,
		ProfileNavBarComponent,
		FriendsComponent,
		ProfilePublicComponent,
		FriendsComponent,
		BlocFriendPublicComponent,
		QrcodeViewComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		ReactiveFormsModule,
		ProfileRoutingModule,
		ProfileOverviewModule,
		ProfileFriendsModule,
		ProfileBlockUsersModule,
		SharingModule,
	],
	exports: [QrcodeViewComponent]
})
export class ProfileModule { }
