import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IProfileFriends } from '../../../models/profile.user.model';
import { ProfileService } from '../../../services/profile.service';

@Component({
	selector: 'app-profile-friends',
	templateUrl: './profile-friends.component.html',
	styleUrls: ['./profile-friends.component.scss']
})
export class ProfileFriendsComponent implements OnInit {

		
	usersList$!: Observable<IProfileFriends[]>;
	constructor(private profileService: ProfileService) { }

	ngOnInit(): void {
		this.usersList$ = this.profileService.getProfileFriends();
	}

	reload() {
		this.usersList$ = this.profileService.getProfileFriends();
	}
}
