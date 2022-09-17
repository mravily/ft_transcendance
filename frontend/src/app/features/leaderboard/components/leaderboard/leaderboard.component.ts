import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

	usersList!: User[];
  constructor(private http: HttpClient) {
	// this.getList();
	// console.log('login_test', this.usersList[0].login);
  }

	getList() {
		this.http.get<User[]>("leaderboard").subscribe(u => this.usersList = u)
	}

  ngOnInit(): void {

	this.usersList = [
		{
			email: 'mravily@student.42.fr',
			login: 'mravily',
			name: 'Medhi Ravily',
			photo: 'https://cdn.intra.42.fr/users/mravily.jpg',
			win: 5,
			loose: 2,
			online: false
		},
		{
			email: 'mravily@student.42.fr',
			login: 'mravily',
			name: 'Medhi Ravily',
			photo: 'https://cdn.intra.42.fr/users/mravily.jpg',
			win: 5,
			loose: 2,
			online: false
		},
		{
			email: 'mravily@student.42.fr',
			login: 'mravily',
			name: 'Medhi Ravily',
			photo: 'https://cdn.intra.42.fr/users/mravily.jpg',
			win: 5,
			loose: 2,
			online: false
		},
		{
			email: 'mravily@student.42.fr',
			login: 'mravily',
			name: 'Medhi Ravily',
			photo: 'https://cdn.intra.42.fr/users/mravily.jpg',
			win: 5,
			loose: 2,
			online: false
		},
		{
			email: 'mravily@student.42.fr',
			login: 'mravily',
			name: 'Medhi Ravily',
			photo: 'https://cdn.intra.42.fr/users/mravily.jpg',
			win: 5,
			loose: 2,
			online: false
		},
	];
  }

}
