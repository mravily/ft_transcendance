import { NgModule } from '@angular/core';
import { ProfileOverviewComponent } from './components/profile-overview.component';
import { LastActivityComponent } from './components/last-activity/last-activity.component';
import { BlockActivityComponent } from './components/last-activity/block-activity/block-activity.component';
import { CardStatsComponent } from './components/card-stats/card-stats.component';
import { SharingModule } from 'src/app/pipe/sharing.module';
import { MatchHistoryComponent } from './components/match-history/match-history.component';
import { BlocMatchComponent } from './components/match-history/bloc-match/bloc-match.component';

@NgModule({
	declarations: [
		ProfileOverviewComponent,
		CardStatsComponent,
		LastActivityComponent,
		MatchHistoryComponent,
		BlocMatchComponent,
		BlockActivityComponent,
	],
	exports: [
		ProfileOverviewComponent,
		CardStatsComponent,
		LastActivityComponent,
		MatchHistoryComponent,
		BlocMatchComponent,
		BlockActivityComponent
	],
	imports: [SharingModule]
})
export class ProfileOverviewModule { }
