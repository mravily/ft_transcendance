import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

const routes: Routes = [
	{ path: 'view', component: NavBarComponent, children: [
		{ path: '', component: LeaderboardComponent },
		{ path: 'users', component: AllUsersComponent }
	]},
  ];
  
  @NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
  })
export class LeaderboardRoutingModule { }
