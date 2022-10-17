import { Component, Input, OnInit } from '@angular/core';
import { IAccount } from 'src/app/model/user.model';

@Component({
	selector: 'app-bloc-friend-public',
	templateUrl: './bloc-friend-public.component.html',
	styleUrls: ['./bloc-friend-public.component.scss']
})
export class BlocFriendPublicComponent implements OnInit {

	@Input() friend!: IAccount;

	constructor() { }

	ngOnInit(): void {
	}

}
