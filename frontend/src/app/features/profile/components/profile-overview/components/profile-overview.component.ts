import { Component, OnInit } from '@angular/core';
import { ProfileOverview } from '../../../models/profile.user.model';

@Component({
	selector: 'app-profile-overview',
	templateUrl: './profile-overview.component.html',
	styleUrls: ['./profile-overview.component.scss']
})
export class ProfileOverviewComponent implements OnInit {

	// userData$!: ProfileOverview;
	// constructor(private profileService: ProfileService) {}
	// ngOnInit(): void {
	//   this.userData$ = this.profileService.getOverview();
	// }
	userData$!: ProfileOverview;

	constructor() { }

	ngOnInit(): void {
		this.userData$ = {
			cardStats:
			{
				win: 150,
				lost: 15,
				rank: 3,
				friends: 15
			},
			activities: [
				{
					avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
					displayName: 'Juan Iglesias',
					createdAt: new Date,
					message: 'send you a match request'
				},
				{
					avatar: 'https://cdn.intra.42.fr/users/adesvall.jpg',
					displayName: 'Augustin Desvallées',
					createdAt: new Date,
					message: 'send you a message'
				},
				{
					avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
					displayName: 'Juan Iglesias',
					createdAt: new Date,
					message: 'send you a join channel request'
				},
				{
					avatar: 'https://preview.webpixels.io/web/img/other/logos/logo-4.png',
					displayName: 'Mailchimp Channel',
					createdAt: new Date,
					message: 'have new messages unread'
				},
				{
					avatar: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80',
					displayName: 'Robert Fox',
					createdAt: new Date,
					message: 'send you a friend request'
				},
			],
			matches: [
				{
					usrAvatar: 'https://cdn.intra.42.fr/users/mravily.jpg',
					usrDisplayName: 'Medhi Ravily',
					usrScore: 10,
					opScore: 8,
					opAvatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
					opDisplayName: 'Juan Iglesias',
					opLogin: 'jiglesia'
				},
				{
					usrAvatar: 'https://cdn.intra.42.fr/users/mravily.jpg',
					usrDisplayName: 'Medhi Ravily',
					usrScore: 3,
					opScore: 10,
					opAvatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
					opDisplayName: 'Juan Iglesias',
					opLogin: 'jiglesia'
				},
			]
		};
	}

}
