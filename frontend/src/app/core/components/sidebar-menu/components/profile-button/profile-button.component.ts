import { Component, Input, OnInit } from '@angular/core';
import { SideBarData } from '../../model/sidebar.model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-button',
  templateUrl: './profile-button.component.html',
  styleUrls: ['./profile-button.component.scss']
})
export class ProfileButtonComponent implements OnInit {

  @Input() profile!: SideBarData;
  
  constructor(private cookieService: CookieService,
			  private router: Router) { }

  ngOnInit(): void {
  }

  isLogout() {
	this.cookieService.delete('token');
	this.router.navigateByUrl('/');
  }
}
