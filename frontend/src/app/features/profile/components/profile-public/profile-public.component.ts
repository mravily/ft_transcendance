import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
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
	actionBlock: string = 'Block';
	actionAdd: string = 'Add Friend';

	constructor(private profileService: ProfileService,
				private route: ActivatedRoute,
				private cookieService: CookieService,
				private router: Router) {
		this.route.params.subscribe((params) => {
			this.userID = params["id"]
			console.log('userID', this.userID);
			this.profileService.isUser(this.userID).subscribe(v => {
				console.log('v-test', v);
				if (!v)
					this.router.navigateByUrl('/404');
			})	
		})
	}
	
	ngOnInit(): void {
		this.data$ = this.profileService.getPublicProfile(this.userID)
	}

	isLogin() {
		return this.cookieService.check('access');
	}

	onClickBlockUser() {
		if(this.actionBlock == 'Block') {
		  this.actionBlock = 'Unblock';
		  this.profileService.unBlockUser(this.userID);
		} else {
		  this.actionBlock = 'Block';
		  this.profileService.blockUser(this.userID);   
		}
	}

	onClickAddUser() {
		if(this.actionAdd == 'Add Friend') {
		  this.actionAdd = 'Remove Friend';
		  this.profileService.sendFriendRequest(this.userID);
		} else {
		  this.actionAdd = 'Add Friend';
		//   this.profileService.removeFriendship(this.userID);
		}
	}
}
