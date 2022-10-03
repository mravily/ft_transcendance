import { Component, Input, OnInit } from '@angular/core';
import { Friend } from 'src/app/features/profile/models/profile.user.model';

@Component({
	selector: 'app-bloc-friend-public',
	templateUrl: './bloc-friend-public.component.html',
	styleUrls: ['./bloc-friend-public.component.scss']
})
export class BlocFriendPublicComponent implements OnInit {

	@Input() friend!: Friend;

	constructor() { }

	ngOnInit(): void {
	}

}
