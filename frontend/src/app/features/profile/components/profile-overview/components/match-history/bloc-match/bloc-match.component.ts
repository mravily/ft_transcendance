import { Component, Input, OnInit } from '@angular/core';
import { Match } from 'src/app/features/profile/models/profile.user.model';

@Component({
	selector: 'app-bloc-match',
	templateUrl: './bloc-match.component.html',
	styleUrls: ['./bloc-match.component.scss']
})
export class BlocMatchComponent implements OnInit {

	@Input() match!: Match;

	constructor() { }

	ngOnInit(): void {
	}

}
