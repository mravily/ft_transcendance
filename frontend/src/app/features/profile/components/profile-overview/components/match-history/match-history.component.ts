import { Component, Input, OnInit } from '@angular/core';
import { Match } from 'src/app/features/profile/models/profile.user.model';

@Component({
	selector: 'app-match-history',
	templateUrl: './match-history.component.html',
	styleUrls: ['./match-history.component.scss']
})
export class MatchHistoryComponent implements OnInit {

	@Input() matches!: any[];

	constructor() { }

	ngOnInit(): void {
	}
}
