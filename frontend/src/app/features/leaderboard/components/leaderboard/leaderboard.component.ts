import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
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
	socket!: Socket;

    constructor(private leaderboardService: LeaderboardService) {
		this.socket = leaderboardService.initSocket();
	  	this.usersList$ = leaderboardService.getDataTop10(this.socket);
    }

	ngOnInit(): void {
	}

  	ngOnDestroy() {
		this.leaderboardService.disconnectSocket(this.socket);
  	}
}
