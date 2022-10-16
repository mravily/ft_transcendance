import { Component, Input, OnInit } from '@angular/core';
import { IAccount } from 'src/app/model/user.model';

@Component({
	selector: 'app-friends',
	templateUrl: './friends.component.html',
	styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

	@Input() friends!: IAccount[];

	constructor() { }

	ngOnInit(): void {
	}

}
