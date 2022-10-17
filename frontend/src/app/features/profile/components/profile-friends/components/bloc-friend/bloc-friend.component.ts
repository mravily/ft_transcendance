import { Component, Input, OnInit } from '@angular/core';
import { IAccount } from 'src/app/model/user.model';

@Component({
  selector: 'app-bloc-friend',
  templateUrl: './bloc-friend.component.html',
  styleUrls: ['./bloc-friend.component.scss']
})
export class BlocFriendComponent implements OnInit {

	@Input() friend!: IAccount;
	@Input() rank!: number;
	
	constructor() { }
  
	ngOnInit(): void {
	}
}
