import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentMatch } from '../models/current-match.model';

@Component({
  selector: 'app-current-match',
  templateUrl: './current-match.component.html',
  styleUrls: ['./current-match.component.scss']
})
export class CurrentMatchComponent implements OnInit {

	matches!: CurrentMatch[];
	
  	constructor() { }

  	ngOnInit(): void {
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

}
