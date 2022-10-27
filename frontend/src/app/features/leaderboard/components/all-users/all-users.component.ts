import { Component, OnDestroy, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { LeaderboardService } from 'src/app/features/leaderboard/services/leaderboard.service';
import { IAccount } from 'src/app/model/user.model';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnDestroy {

	usersList$!: Observable<IAccount[]>;
	socket!: Socket;

	constructor(private leaderboardService: LeaderboardService) {
		this.socket = leaderboardService.initSocket();
		this.usersList$ = leaderboardService.getAllUsers(this.socket);
	}

	ngOnDestroy(): void {
		this.leaderboardService.disconnectSocket(this.socket);
	}
}
