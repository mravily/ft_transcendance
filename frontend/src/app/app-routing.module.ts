import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaderboardComponent } from './features/leaderboard/components/leaderboard/leaderboard.component';
import { SignInComponent } from './features/sign-in/sign-in.component';
import { AuthGuard } from './guards/auth.guard';
import { PongComponent } from './pong/components/pong/pong.component';
import { LandingPageComponent } from './pong/landing-page/landing-page.component';


const routes: Routes = [
	{ path: 'sign-in', component: SignInComponent },
	{ path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard] },
	{ path: 'pong', component: LandingPageComponent, canActivate: [AuthGuard] },
	{ path: 'pong/:gameId', component: PongComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
