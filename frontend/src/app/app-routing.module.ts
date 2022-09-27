import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavBarComponent } from './features/leaderboard/components/nav-bar/nav-bar.component';
import { SignInComponent } from './features/sign-in/sign-in.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
	{ path: '', component: NavBarComponent },
	{ path: 'sign-in', component: SignInComponent },
	{ path: 'view', loadChildren: () => import('./features/leaderboard/leaderboard.module').then(m => m.LeaderboardModule), canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
