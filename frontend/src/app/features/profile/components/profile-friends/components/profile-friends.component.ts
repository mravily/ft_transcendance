import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/features/leaderboard/model/user.model';
// import { ProfileService } from '../../services/profile.service';

@Component({
	selector: 'app-profile-friends',
	templateUrl: './profile-friends.component.html',
	styleUrls: ['./profile-friends.component.scss']
})
export class ProfileFriendsComponent implements OnInit {

	// usersList$!: Observable<User[]>;
	// constructor(private profileService: ProfileService) { }

	// ngOnInit(): void {
	// 		this.usersList$ = this.profileService.getAllFriends();
	// }

	friendsList$!: User[];

	constructor() {}

	ngOnInit(): void {
		this.friendsList$ = [
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			{
				avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg',
				fullName: 'Juan Iglesias',
				login: 'jiglesia',
				win: 150,
				lost: 13,
				isOnline: true,
				score: 26,
				email: 'jiglesias@student.42.fr'
			},
			
		]
	}
}
