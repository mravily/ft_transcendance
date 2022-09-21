import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './features/guards/auth.guard';
import { LeaderboardComponent } from './features/leaderboard/components/leaderboard/leaderboard.component';


const routes: Routes = [
	{ path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard] },
	{ path: 'profile', loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
