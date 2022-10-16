import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IAccount } from 'src/app/model/user.model';
import { ProfileService } from '../../../services/profile.service';

@Component({
	selector: 'app-profile-overview',
	templateUrl: './profile-overview.component.html',
	styleUrls: ['./profile-overview.component.scss']
})
export class ProfileOverviewComponent implements OnInit {

	data$!: Observable<IAccount>;

	constructor(private profileService: ProfileService) { }

	ngOnInit(): void {
		this.data$ = this.profileService.getOverview();
		this.data$.subscribe(v => console.log('v', v));
	}

}
