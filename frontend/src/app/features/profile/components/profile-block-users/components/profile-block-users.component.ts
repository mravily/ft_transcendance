import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IAccount } from 'src/app/model/user.model';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-profile-block-users',
  templateUrl: './profile-block-users.component.html',
  styleUrls: ['./profile-block-users.component.scss']
})
export class ProfileBlockUsersComponent implements OnInit {

	usersList$!: Observable<IAccount[]>;

	constructor(private profileService: ProfileService,
				private router: Router) { }

	ngOnInit(): void {
		this.usersList$ = this.profileService.getBlockedUser();
	}

}
