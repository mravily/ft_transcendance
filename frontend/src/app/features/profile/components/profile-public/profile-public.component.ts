import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileOverview, ProfilePublic } from '../../models/profile.user.model';

@Component({
  selector: 'app-profile-public',
  templateUrl: './profile-public.component.html',
  styleUrls: ['./profile-public.component.scss']
})

export class ProfilePublicComponent implements OnInit {

	// userData$!: ProfileOverview;
	// constructor(private profileService: ProfileService) {}
	// ngOnInit(): void {
	//   this.userData$ = this.profileService.getOverview();
	// }
	userId!: string;
	userData$!: ProfilePublic;
	
	constructor(private route: ActivatedRoute) { }
	
	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			this.userId = params["id"];
		})
		this.userData$ = {
			cardStats:
			{
				win: 150,
				lost: 15,
				rank: 3,
				friends: 15
			},
			friends: [
				{
					avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
					displayName: 'Juan Iglesias',
					login: 'jiglesia'
				},
				{
					avatar: 'https://cdn.intra.42.fr/users/adesvall.jpg',
					displayName: 'Augustin Desvallées',
					login: 'adesvall'
				},
				{
					avatar: 'https://preview.webpixels.io/web/img/other/logos/logo-4.png',
					displayName: 'Mailchimp Channel',
					login: 'monkey'
				},
				{
					avatar: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80',
					displayName: 'Robert Fox',
					login: 'rfox'
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
