import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { CurrentMatchComponent } from './components/current-match/components/current-match.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

const routes: Routes = [
	{ path: '', component: NavBarComponent, children: [
		{ path: '', component: LeaderboardComponent },
		{ path: 'users', component: AllUsersComponent },
		{ path: 'current-match', component: CurrentMatchComponent },
	]},
  ];
  
  @NgModule({
	imports: [RouterModule.forChild(routes,)],
	exports: [RouterModule]
  })
export class LeaderboardRoutingModule { }
