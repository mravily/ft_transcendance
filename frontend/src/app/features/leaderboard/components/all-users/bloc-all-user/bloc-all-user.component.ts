import { Component, OnInit, Input } from '@angular/core';
import { IAccount } from 'src/app/model/user.model';


@Component({
	selector: 'app-bloc-all-user',
	templateUrl: './bloc-all-user.component.html',
	styleUrls: ['./bloc-all-user.component.scss']
})
export class BlocAllUserComponent implements OnInit {

	@Input() user!: IAccount;
	@Input() rank!: number;

	constructor() { }

	ngOnInit(): void {
	}

}
