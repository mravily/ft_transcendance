import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaderboardComponent } from './features/leaderboard/components/leaderboard/leaderboard.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
	{ path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard] }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
