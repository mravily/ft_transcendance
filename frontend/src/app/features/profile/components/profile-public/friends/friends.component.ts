import { Component, Input, OnInit } from '@angular/core';
import { Friend } from 'src/app/features/profile/models/profile.user.model';

@Component({
	selector: 'app-friends',
	templateUrl: './friends.component.html',
	styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

	@Input() friends!: Friend[];

	constructor() { }

	ngOnInit(): void {
	}

}
