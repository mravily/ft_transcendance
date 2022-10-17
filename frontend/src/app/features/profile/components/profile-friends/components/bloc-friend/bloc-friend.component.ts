import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProfileFriends } from 'src/app/features/profile/models/profile.user.model';

@Component({
  selector: 'app-bloc-friend',
  templateUrl: './bloc-friend.component.html',
  styleUrls: ['./bloc-friend.component.scss']
})
export class BlocFriendComponent implements OnInit {

	@Input() friend!: IProfileFriends;
	
	constructor(private router: Router) { }
  
	ngOnInit(): void { }

	reload() {
		this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
			this.router.navigate(['/profile/friends']);
		}); 
	}
}
