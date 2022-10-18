import { Component, OnInit } from '@angular/core';
import { PongService } from 'src/app/features/pong/services/pong.service';
import { Observable} from 'rxjs';
import { IMatch } from 'src/app/interfaces';

@Component({
  selector: 'app-current-match',
  templateUrl: './current-match.component.html',
  styleUrls: ['./current-match.component.scss']
})
export class CurrentMatchComponent implements OnInit {

	matches$!: Observable<IMatch[]>;
	time!: NodeJS.Timer;
	
  	constructor(private pongService: PongService) {
		this.matches$ = pongService.liveGamesEvent;
		pongService.liveGamesEvent.subscribe(v => console.log('v', v));
	}

  	ngOnInit(): void {
		this.time = setInterval(() => this.pongService.getLiveGames(), 1000);

  	}
	ngOnDestroy() {
		clearInterval(this.time);
	}

}
