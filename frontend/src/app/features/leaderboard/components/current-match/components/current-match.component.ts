import { Component, OnInit } from '@angular/core';
import { PongService } from 'src/app/features/pong/services/pong.service';
import { IMatch } from 'src/app/interfaces';
import { CurrentMatch } from '../models/current-match.model';

@Component({
  selector: 'app-current-match',
  templateUrl: './current-match.component.html',
  styleUrls: ['./current-match.component.scss']
})
export class CurrentMatchComponent implements OnInit {

	matches!: CurrentMatch[];
	time!: NodeJS.Timer;
	
  	constructor(private pongService: PongService) {
		pongService.liveGamesEvent.subscribe((v: IMatch[]) => {
			console.log('v-current-match', v);
		})
	}

  	ngOnInit(): void {
		this.time = setInterval(() => this.pongService.getLiveGames(), 1000);
		this.matches = [
			{
				gameID: 1,
				p1Avatar: 'https://cdn.intra.42.fr/users/mravily.jpg',
				p1Login: 'mravily',
				p1Score: 15,
				p2Score: 16,
				p2Avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				p2Login: 'jiglesia'
			}
		]
  	}
	ngOnDestroy() {
		clearInterval(this.time);
	}

}
