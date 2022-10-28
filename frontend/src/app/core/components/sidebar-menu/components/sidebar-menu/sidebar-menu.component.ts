import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subscription } from 'rxjs';
import { IAccount } from 'src/app/model/user.model';
import { SidebarMenuService } from '../../services/sidebar-menu.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})

export class SidebarMenuComponent implements OnInit {

	private subscription: Subscription;
	data$!: Observable<IAccount>;

	constructor(private cookieService: CookieService,
		private sidebarServices:SidebarMenuService,
		private router: Router) {
			this.subscription = this.sidebarServices.getUpdate().subscribe( msg => {
				if (msg == true)
					this.reload();
			});
			this.data$ = this.sidebarServices.data
			// console.log(this.data$);
		}
		
		ngOnInit(): void {
			this.sidebarServices.getData();
		}

		reload() {
			this.sidebarServices.reloadSocket();
			this.data$ = this.sidebarServices.data;
			// this.sidebarServices.getData();
		}
		
		isLogin() {
			return this.cookieService.check('access');
		}

		ngOnDestroy() {
		}
	}
