import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IAccount } from 'src/app/model/user.model';

@Component({
  selector: 'app-bloc-block-users',
  templateUrl: './bloc-block-users.component.html',
  styleUrls: ['./bloc-block-users.component.scss']
})
export class BlocBlockUsersComponent implements OnInit {

	@Input() user!: IAccount;

  	constructor(private router: Router) { }

  	ngOnInit(): void {
  	}

	reload() {
		this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
			this.router.navigate([this.router.url]);
		}); 
	}
}
