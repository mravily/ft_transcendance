import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePublicComponent } from './features/profile/components/profile-public/profile-public.component';
import { SignInComponent } from './features/sign-in/sign-in.component';
import { AuthGuard } from './guards/auth.guard';
import { TfaComponent } from './features/tfa/tfa.component';
import { QrcodeViewComponent } from './features/profile/components/profile-security/qrcode-view/qrcode-view.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';

const routes: Routes = [
	{ path: '', component: LandingPageComponent },
	{ path: 'qrcode', component: QrcodeViewComponent, canActivate: [AuthGuard]},
	{ path: 'tfa', component: TfaComponent },
	{ path: 'user/:id', component: ProfilePublicComponent },
	{ path: 'sign-in', component: SignInComponent },
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
