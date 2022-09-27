import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaderboardComponent } from './features/leaderboard/components/leaderboard/leaderboard.component';
import { SignInComponent } from './features/sign-in/sign-in.component';
import { AuthGuard } from './guards/auth.guard';
import { PongComponent } from './pong/components/pong/pong.component';
import { LandingPageComponent } from './pong/landing-page/landing-page.component';


const routes: Routes = [
<<<<<<< HEAD
	{ path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard] },
	{ path: 'pong', component: LandingPageComponent, canActivate: [AuthGuard] },
	{ path: 'pong/:gameId', component: PongComponent, canActivate: [AuthGuard] }
];
=======
	{ path: 'sign-in', component: SignInComponent },
	{ path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard] }];
>>>>>>> b6dd696c23efce8dff347ad191c77aa36947b0b9

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
