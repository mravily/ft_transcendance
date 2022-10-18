import { Component, Input, OnInit } from '@angular/core';
import { CurrentMatch } from '../../models/current-match.model';

@Component({
	selector: 'app-bloc-current-match',
	templateUrl: './bloc-current-match.component.html',
	styleUrls: ['./bloc-current-match.component.scss']
})
export class BlocCurrentMatchComponent implements OnInit {

	@Input() match!: CurrentMatch;

	constructor() { }

	ngOnInit(): void {
	}

}
