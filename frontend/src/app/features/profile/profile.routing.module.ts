import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ProfileFriendsComponent } from './components/profile-friends/components/profile-friends.component';
import { ProfileNavBarComponent } from './components/profile-nav-bar/profile-nav-bar.component';
import { ProfileOverviewComponent } from './components/profile-overview/components/profile-overview.component';
import { ProfileSecurityComponent } from './components/profile-security/profile-security.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';

const routes: Routes = [
	{ path: '', component: ProfileNavBarComponent, children: [
		{ path: '', component: ProfileOverviewComponent },
		{ path: 'friends', component: ProfileFriendsComponent },
		{ path: 'settings', component: ProfileSettingsComponent },
		{ path: 'security', component: ProfileSecurityComponent },
	], canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
