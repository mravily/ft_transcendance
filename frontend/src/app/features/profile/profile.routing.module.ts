import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ProfileBlockUsersComponent } from './components/profile-block-users/components/profile-block-users.component';
import { ProfileFriendsComponent } from './components/profile-friends/components/profile-friends.component';
import { ProfileNavBarComponent } from './components/profile-nav-bar/profile-nav-bar.component';
import { ProfileOverviewComponent } from './components/profile-overview/components/profile-overview.component';
import { ProfileSecurityComponent } from './components/profile-security/profile-security.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';

const routes: Routes = [
	{ path: '', component: ProfileNavBarComponent, children: [
		{ path: '', component: ProfileOverviewComponent, canActivate: [AuthGuard] },
		{ path: 'friends', component: ProfileFriendsComponent, canActivate: [AuthGuard] },
		{ path: 'block-users', component: ProfileBlockUsersComponent, canActivate: [AuthGuard]},
		{ path: 'settings', component: ProfileSettingsComponent, canActivate: [AuthGuard] },
		{ path: 'security', component: ProfileSecurityComponent, canActivate: [AuthGuard] },
	], canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
