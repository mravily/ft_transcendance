import { Component, Input, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { IAccount } from 'src/app/model/user.model';

@Component({
  selector: 'app-profile-button',
  templateUrl: './profile-button.component.html',
  styleUrls: ['./profile-button.component.scss']
})
export class ProfileButtonComponent implements OnInit {

  @Input() profile!: IAccount;
  
  constructor(private cookieService: CookieService,
			  private router: Router) { }

  ngOnInit(): void {
  }

  isLogout() {
	this.cookieService.delete('access');
	this.router.navigateByUrl('/');
  }
}
