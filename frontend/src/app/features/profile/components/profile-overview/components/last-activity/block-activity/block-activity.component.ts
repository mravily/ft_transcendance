import { Component, Input, OnInit } from '@angular/core';
import { Activity } from 'src/app/features/profile/models/profile.user.model';

@Component({
	selector: 'app-block-activity',
	templateUrl: './block-activity.component.html',
	styleUrls: ['./block-activity.component.scss']
})
export class BlockActivityComponent implements OnInit {

	@Input() activity!: Activity;

	constructor() { }

	ngOnInit(): void {
	}

}
