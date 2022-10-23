import { Component, Input, OnInit } from '@angular/core';
import { IMatch } from 'src/app/interfaces';

@Component({
	selector: 'app-bloc-current-match',
	templateUrl: './bloc-current-match.component.html',
	styleUrls: ['./bloc-current-match.component.scss']
})
export class BlocCurrentMatchComponent implements OnInit {

	@Input() match!: IMatch;

	constructor() { }

	ngOnInit(): void {
	}

}
