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
  time!: NodeJS.Timer;

    constructor(private leaderboardService: LeaderboardService) {
      this.usersList$ = this.leaderboardService.getTopTen();
    }

	ngOnInit(): void {
    this.time = setInterval(() => { this.usersList$ = this.leaderboardService.getTopTen();}, 5000);
	}

  ngOnDestroy() {
    clearInterval(this.time);
  }
}
