import { Component, OnInit } from '@angular/core';
import { Observable} from 'rxjs';
import { User } from 'src/app/features/leaderboard/model/user.model';
import { LeaderboardService } from '../../services/leaderboard.service';

@Component({
  selector: 'app-old-leaderboard',
  templateUrl: './old-leaderboard.component.html',
  styleUrls: ['./old-leaderboard.component.css']
})
export class OldLeaderboardComponent implements OnInit {

	usersList$!: Observable<User[]>;

    constructor(private leaderboardService: LeaderboardService) {}

	ngOnInit(): void {
		this.usersList$ = this.leaderboardService.getList();
	}
}
