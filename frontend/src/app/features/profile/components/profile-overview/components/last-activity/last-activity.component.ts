import { Component, Input, OnInit } from '@angular/core';
import { Activity } from 'src/app/features/profile/models/profile.user.model';

@Component({
	selector: 'app-last-activity',
	templateUrl: './last-activity.component.html',
	styleUrls: ['./last-activity.component.scss']
})
export class LastActivityComponent implements OnInit {

	@Input() activities!: Activity[];

	constructor() { }

	ngOnInit(): void {
	}

}
