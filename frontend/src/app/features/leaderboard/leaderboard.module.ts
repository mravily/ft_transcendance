import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { BlocUserComponent } from './components/bloc-user/bloc-user.component';
import { OrdinalPipe } from 'src/app/pipe/ordinals.pipe';

@NgModule({
  declarations: [LeaderboardComponent, BlocUserComponent, OrdinalPipe],
  imports: [CommonModule],
  exports: [BlocUserComponent]
})
export class LeaderboardModule { }
