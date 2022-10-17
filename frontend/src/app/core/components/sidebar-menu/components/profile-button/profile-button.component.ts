import { Component, Input, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { IAccount } from 'src/app/model/user.model';
import { SidebarMenuService } from '../../services/sidebar-menu.service';

@Component({
  selector: 'app-profile-button',
  templateUrl: './profile-button.component.html',
  styleUrls: ['./profile-button.component.scss']
})
export class ProfileButtonComponent implements OnInit {

  @Input() profile!: IAccount;
  
  constructor(private cookieService: CookieService,
			  private router: Router,
			  private sidebarService: SidebarMenuService) { }

  ngOnInit(): void {
  }

  isLogout() {
	this.sidebarService.signOut();
	this.router.navigateByUrl('/');
  }
}
