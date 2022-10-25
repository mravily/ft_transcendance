import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { IAccount } from 'src/app/model/user.model';
import { SidebarMenuService } from '../../services/sidebar-menu.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})

export class SidebarMenuComponent implements OnInit {

	data$!: Observable<IAccount>;
	time!: NodeJS.Timer;
	isSocket: boolean = false;

	constructor(private cookieService: CookieService,
		private sidebarServices:SidebarMenuService,
		private router: Router) {
				
			// console.log(this.data$);
		}
		
		ngOnInit(): void {
			this.data$ = this.sidebarServices.data
			this.sidebarServices.getData();
				// this.time = setInterval(() => { this.data$ = this.sidebarServices.data;}, 5000);
		}

		reload() {
				this.sidebarServices.getData();
				// this.data$ = this.sidebarServices.data;
		}
		
		isLogin() {
			return this.cookieService.check('access');
		}

		ngOnDestroy() {
			clearInterval(this.time);
		}
	}
