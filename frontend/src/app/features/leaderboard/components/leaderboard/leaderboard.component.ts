import { Component, OnInit } from '@angular/core';
import { Observable} from 'rxjs';
import { IAccount } from 'src/app/model/user.model';
import { LeaderboardService } from '../../services/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

	usersList$!: Observable<IAccount[]>;

    constructor(private leaderboardService: LeaderboardService) {}

	ngOnInit(): void {
		this.usersList$ = this.leaderboardService.getTopTen();
	}
}
