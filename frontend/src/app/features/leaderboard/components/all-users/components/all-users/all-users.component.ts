import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/features/leaderboard/model/user.model';
import { LeaderboardService } from 'src/app/features/leaderboard/services/leaderboard.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {

	// usersList$!: User[];
	// constructor() {}

	// ngOnInit(): void {
	// 	this.usersList$ = [
	// 		{
	// 			email: 'CraigLDolan@dayrep.com',
	// 			login: 'cdolan',
	// 			fullName: 'Craig Dolan',
	// 			imgUrl: 'https://s3.amazonaws.com/cornellbigred.com/images/2021/11/3/Dolan_Greg_uni_CROP.jpg',
	// 			score: 15,
	// 			isOnline: true,
	// 			win: 25,
	// 			lost: 3
	// 		},
	// 		{
	// 			email: 'StephanieTMiller@rhyta.com',
	// 			login: 'smiller',
	// 			fullName: 'Stephanie T. Miller',
	// 			imgUrl: 'https://www.stephaniemiller.com/wp-content/uploads/2012/08/stephwebitunes.jpg',
	// 			score: 13,
	// 			isOnline: false,
	// 			win: 17,
	// 			lost: 6
	// 		},
	// 		{
	// 			email: 'JavierDuplessis@rhyta.com',
	// 			login: 'jduples',
	// 			fullName: 'Javier Duplessis',
	// 			imgUrl: 'https://image-uviadeo.journaldunet.com/image/450/1121048283/1326896.jpg',
	// 			score: 10,
	// 			isOnline: true,
	// 			win: 13,
	// 			lost: 8
	// 		},
	// 		{
	// 			email: 'CamilaFernandesAraujo@rhyta.com',
	// 			login: 'cfaraujo',
	// 			fullName: 'Camila Fernandes Araujo',
	// 			imgUrl: 'https://www.cel.com.br/wp-content/uploads/2021/05/foto-camila-de-araujo-fernandes-peixoto-nossa-comunidade-cel-intercultural-school.jpg',
	// 			score: 8,
	// 			isOnline: false,
	// 			win: 6,
	// 			lost: 5
	// 		},
	// 	]
	// }
	usersList$!: Observable<User[]>;
	constructor(private leaderboardService: LeaderboardService) { }

	ngOnInit(): void {
			this.usersList$ = this.leaderboardService.getAllUsers();
	}

}
