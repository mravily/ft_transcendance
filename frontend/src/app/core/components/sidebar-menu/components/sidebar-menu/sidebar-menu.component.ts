import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { SideBarData } from '../../model/sidebar.model';
import { SidebarMenuService } from '../../services/sidebar-menu.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})

export class SidebarMenuComponent implements OnInit {

	// A utiliser pour la récupération des infos depuis la DB
	// 	 data$!: SidebarData;
	//   constructor(private sidebarServices:SidebarMenuService,
	//  			 private cookieService: CookieService) { }
	
	//   ngOnInit(): void {
	// 			this.data$ = this.sidebarServices.getAllUsers();
	//   }
		
		isLogin() {
			return this.cookieService.check('token');
		}
		
	data$!: SideBarData;
	constructor(private cookieService: CookieService) {}

	ngOnInit(): void {
		this.data$ = {
			fullName: "Medhi Ravily",
			login: "mravily",
			avatar: 'https://cdn.intra.42.fr/users/mravily.jpg',
			friendsList: [
				{
					fullName: 'Juan Carlos Iglesias Gonzalez',
					login: 'jiglesia',
					isOnline: true,
					avatar: 'https://cdn.intra.42.fr/users/jiglesia.jpg'
				},
				{
					fullName: 'Augustin Desvallées',
					login: 'adesvall',
					isOnline: false,
					avatar: 'https://cdn.intra.42.fr/users/adesvall.jpg'
				},
				{
					fullName: 'Ulysse Peyret',
					login: 'upeyret',
					isOnline: false,
					avatar: 'https://cdn.intra.42.fr/users/upeyret.jpg'
				}
			],
			friends: 69,
		}
	}
	
}
