import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './features/sign-in/sign-in.component';
import { AuthGuard } from './guards/auth.guard';
import { LobbyComponent } from './features/pong/components/lobby/lobby.component';
import { TfaComponent } from './features/tfa/tfa.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { ProfilePublicComponent } from './features/profile/components/profile-public/profile-public.component';
import { ChatComponent } from './features/chat/components/chat.component';
import { PongComponent } from './features/pong/components/pong/pong.component';


const routes: Routes = [
	{ path: '', component: LandingPageComponent },
	{ path: 'tfa', component: TfaComponent },
	{ path: 'user/:id', component: ProfilePublicComponent },
	{ path: 'sign-in', component: SignInComponent },
	{ path: 'messages', component: ChatComponent, canActivate: [AuthGuard] },
	{ path: 'play', component: LobbyComponent, canActivate: [AuthGuard] },
	{ path: 'play/:gameId', component: PongComponent, canActivate: [AuthGuard] },
	{ path: 'view', loadChildren: () => import('./features/leaderboard/leaderboard.module').then(m => m.LeaderboardModule) },
	{ path: 'profile', loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard] },
	{ path: '**', component: NotFoundComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
