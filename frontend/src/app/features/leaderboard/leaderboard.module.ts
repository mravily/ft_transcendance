import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { BlocUserComponent } from './components/leaderboard/bloc-user/bloc-user.component';
import { OrdinalPipe } from 'src/app/pipe/ordinals.pipe';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { AllUsersComponent } from './components/all-users/components/all-users/all-users.component';
import { BlocAllUserComponent } from './components/all-users/components/bloc-all-user/bloc-all-user.component';

@NgModule({
  declarations: [
	LeaderboardComponent,
	BlocUserComponent,
	AllUsersComponent,
	BlocAllUserComponent,
	OrdinalPipe,
	NavBarComponent,
],
  imports: [
	CommonModule,
	RouterModule,
	LeaderboardRoutingModule,
],
  exports: [
	BlocUserComponent,
	LeaderboardComponent,
	NavBarComponent
]
})
export class LeaderboardModule { }
