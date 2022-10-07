import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaderboardComponent } from './features/leaderboard/components/leaderboard/leaderboard.component';
import { SignInComponent } from './features/sign-in/sign-in.component';
import { AuthGuard } from './guards/auth.guard';
import { PongComponent } from './pong/components/pong/pong.component';
import { LandingPageComponent } from './pong/components/lobby/landing-page.component';
import { ChatComponent } from './chat/components/chat.component';


const routes: Routes = [
	{ path: 'sign-in', component: SignInComponent },
	{ path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard] },
	{ path: 'messages', component: ChatComponent, canActivate: [AuthGuard]},
	{ path: 'play', component: LandingPageComponent},
	{ path: 'play/:gameId', component: PongComponent,},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
