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

	constructor(private cookieService: CookieService,
		private sidebarServices:SidebarMenuService,
		private router: Router) {
			this.data$ = this.sidebarServices.getData();
		}
	
		
		ngOnInit(): void {
			this.time = setInterval(() => { this.data$ = this.sidebarServices.getData();}, 5000);
		}
		
		reload() {
			this.data$ = this.sidebarServices.getData();
		}
		
		isLogin() {
			return this.cookieService.check('access');
		}

		ngOnDestroy() {
			clearInterval(this.time);
		}
	}
