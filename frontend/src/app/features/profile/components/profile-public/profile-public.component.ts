import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
	
	constructor(private profileService: ProfileService,
				private route: ActivatedRoute) {
		this.route.params.subscribe((params) => {
			this.userID = params["id"]
			// this.
		})
	}
	
	ngOnInit(): void {
		this.data$ = this.profileService.getPublicProfile(this.userID)
	}

}
