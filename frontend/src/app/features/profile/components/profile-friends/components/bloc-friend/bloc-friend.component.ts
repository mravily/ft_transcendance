import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/features/leaderboard/model/user.model';

@Component({
  selector: 'app-bloc-friend',
  templateUrl: './bloc-friend.component.html',
  styleUrls: ['./bloc-friend.component.scss']
})
export class BlocFriendComponent implements OnInit {

	@Input() friend!: User;
	@Input() rank!: number;
	
	constructor() { }
  
	ngOnInit(): void {
	}
}
