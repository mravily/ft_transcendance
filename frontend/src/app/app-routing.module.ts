import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './features/sign-in/sign-in.component';
import { AuthGuard } from './guards/auth.guard';
import { PongComponent } from './pong/components/pong/pong.component';
import { LandingPageComponent } from './pong/components/lobby/landing-page.component';
import { ChatComponent } from './chat/components/chat.component';
// import { LeaderboardComponent } from './features/leaderboard/components/leaderboard/leaderboard.component';
import { TfaComponent } from './features/tfa/tfa.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { ProfilePublicComponent } from './features/profile/components/profile-public/profile-public.component';

const routes: Routes = [
	{ path: '', component: LandingPageComponent },
	{ path: 'tfa', component: TfaComponent },
	{ path: 'user/:id', component: ProfilePublicComponent },
	{ path: 'sign-in', component: SignInComponent },
	// { path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard] },
	{ path: 'messages', component: ChatComponent, canActivate: [AuthGuard]},
	{ path: 'play', component: LandingPageComponent, canActivate: [AuthGuard]},
	{ path: 'play/:gameId', component: PongComponent, canActivate: [AuthGuard]},
	{ path: 'view', loadChildren: () => import('./features/leaderboard/leaderboard.module').then(m => m.LeaderboardModule) },
	{ path: 'profile', loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard] },
	{ path: '404', component: NotFoundComponent },
	{ path: '**', redirectTo: '/404' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
