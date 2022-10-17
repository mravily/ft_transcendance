import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IAccount } from 'src/app/model/user.model';
import { ProfileService } from '../../../services/profile.service';

@Component({
	selector: 'app-profile-friends',
	templateUrl: './profile-friends.component.html',
	styleUrls: ['./profile-friends.component.scss']
})
export class ProfileFriendsComponent implements OnInit {

		
	usersList$!: Observable<IAccount>;
	constructor(private profileService: ProfileService) { }

	ngOnInit(): void {
		this.usersList$ = this.profileService.getOverview();
	}
}
