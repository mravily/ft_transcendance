import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LeaderboardService } from 'src/app/features/leaderboard/services/leaderboard.service';
import { IAccount } from 'src/app/model/user.model';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {

	usersList$!: Observable<IAccount[]>;
	
	constructor(private leaderboardService: LeaderboardService) { }

	ngOnInit(): void {
			this.usersList$ = this.leaderboardService.getAllUsers();
	}
}
