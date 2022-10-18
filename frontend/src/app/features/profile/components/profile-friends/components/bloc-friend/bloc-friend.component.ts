import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProfileFriends } from 'src/app/features/profile/models/profile.user.model';
import { ProfileService } from 'src/app/features/profile/services/profile.service';

@Component({
  selector: 'app-bloc-friend',
  templateUrl: './bloc-friend.component.html',
  styleUrls: ['./bloc-friend.component.scss']
})
export class BlocFriendComponent implements OnInit {

	@Input() friend!: IProfileFriends;
	
	constructor(private router: Router,
				private profileService: ProfileService) { }
  
	ngOnInit(): void { }

	reload() {
		this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
			this.router.navigate(['/profile/friends']);
		}); 
	}

	onAcceptFriend(login: string) {
		this.profileService.acceptFriendRequest(login);
		this.reload();
	}

	onRefuseFriendRequest(login: string) {
		this.profileService.removeFriend(login);
		this.reload();
	}

	onBlockUser(login: string) {
		this.profileService.blockUser(login);
		this.reload();
	}
}
