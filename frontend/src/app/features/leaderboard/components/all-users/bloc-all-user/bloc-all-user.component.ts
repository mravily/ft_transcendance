import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/features/leaderboard/model/user.model';


@Component({
	selector: 'app-bloc-all-user',
	templateUrl: './bloc-all-user.component.html',
	styleUrls: ['./bloc-all-user.component.scss']
})
export class BlocAllUserComponent implements OnInit {

	@Input() user!: User;
	@Input() rank!: number;

	constructor() { }

	ngOnInit(): void {
	}

}
