import { NgModule } from '@angular/core';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { BlocUserComponent } from './components/leaderboard/bloc-user/bloc-user.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { BlocAllUserComponent } from './components/all-users/bloc-all-user/bloc-all-user.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { SharingModule } from 'src/app/pipe/sharing.module';
import { CurrentMatchModule } from './components/current-match/current-match.module';


@NgModule({
	declarations: [
		NavBarComponent,
		LeaderboardComponent,
		BlocUserComponent,
		AllUsersComponent,
		BlocAllUserComponent,
	],
	imports: [
		RouterModule,
		LeaderboardRoutingModule,
		CurrentMatchModule,
		SharingModule,
	],
	exports: [
		NavBarComponent,
		LeaderboardComponent,
		BlocUserComponent,
		AllUsersComponent,
		BlocAllUserComponent
	]
})
export class LeaderboardModule { }
