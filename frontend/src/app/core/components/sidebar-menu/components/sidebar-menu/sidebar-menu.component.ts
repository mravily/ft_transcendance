import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { ShortListContact, ShortProfile } from '../../model/sidebar.model';
import { SidebarMenuService } from '../../services/sidebar-menu.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})

export class SidebarMenuComponent implements OnInit {

	constructor(private cookieService: CookieService) {}
// A utiliser pour la r2cup2ration des infos depuis la DB
//   contactList$!: Observable<ShortListContact[]>
//   profile$!: ShortProfile;
//   constructor(private sidebarServices:SidebarMenuService) { }

//   ngOnInit(): void {
// 		this.contactList$ = this.sidebarServices.getList();
//  	this.profile$ = this.sidebarService.getProfile();
// 		this.messages$ = this.sidebarService.getmessages();
//   }

	isLogin() {
		return this.cookieService.check('token');
	}
	contactList!: ShortListContact[];
	profile!: ShortProfile;
	messages!: number;

	ngOnInit(): void {
		this.messages = 69;

		this.profile = {
			fullName: "Medhi Ravily",
			avatar: 'https://cdn.intra.42.fr/users/mravily.jpg'
		};

		this.contactList = [
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
		]
	}

}
