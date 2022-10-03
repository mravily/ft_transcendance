import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/features/leaderboard/model/user.model';
import { LeaderboardService } from 'src/app/features/leaderboard/services/leaderboard.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {

	usersList$!: Observable<User[]>;
	
	constructor(private leaderboardService: LeaderboardService) { }

	ngOnInit(): void {
			this.usersList$ = this.leaderboardService.getAllUsers();
	}
}
