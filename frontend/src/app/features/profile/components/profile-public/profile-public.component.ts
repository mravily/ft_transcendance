import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject, takeUntil, takeWhile } from 'rxjs';
import { IAccount } from 'src/app/model/user.model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-public',
  templateUrl: './profile-public.component.html',
  styleUrls: ['./profile-public.component.scss']
})

export class ProfilePublicComponent implements OnInit {

	data$!: Observable<IAccount>;
	userID!: string;
	actionBlock!: string;
	actionAdd!: string;
	myProfile!: boolean;
	
	constructor(private profileService: ProfileService,
		private route: ActivatedRoute,
		private cookieService: CookieService,
		private router: Router) {
		this.getInfoProfile();
		this.isFriend(this.userID);
		this.isBlocked(this.userID);
	}
	
	ngOnInit(): void {
		this.data$ = this.profileService.getPublicProfile(this.userID);
		this.reload();
	}

	isFriend(login: string) {
		this.profileService.isFriend(login).subscribe(v => {
			if (v[0] || v[1]) this.actionAdd = 'Remove Friend';
			else this.actionAdd = 'Add Friend';
		})
	}

	isBlocked(login: string) {
		this.profileService.isBlocked(login).subscribe(v => {
			if (v) this.actionBlock = 'UnBlock';
			else this.actionBlock = 'Block';
		})
	}
	isLogin() {
		return this.cookieService.check('access');
	}

	reload() {
		this.data$ = this.profileService.getPublicProfile(this.userID);
	}

	getInfoProfile() {
		this.route.params.subscribe((params) => {
			this.userID = params["id"]
			this.isMyProfile();
			this.profileService.isUser(this.userID).subscribe(v => {
				if (!v)
					this.router.navigateByUrl('/404');
			})	
		})
	}

	isMyProfile() {
		this.profileService.isMyProfile(this.userID).subscribe(v => {
			console.log('v', v)
			this.myProfile = v
		});
	}

	onClickBlockUser() {
		if(this.actionBlock == 'Block') {
		  this.actionBlock = 'Unblock';
		  this.profileService.unBlockUser(this.userID);
		} else {
		  this.actionBlock = 'Block';
		  this.profileService.blockUser(this.userID);   
		}
		this.reload();
	}

	onClickAddUser(login: string) {

		if(this.actionAdd == 'Add Friend') {
		  this.actionAdd = 'Remove Friend';
		  this.profileService.sendFriendRequest(this.userID);
		} else {
		  this.actionAdd = 'Add Friend';
		  this.profileService.removeFriend(this.userID);
		}
		this.reload();
	}

}
