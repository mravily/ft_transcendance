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

	constructor(private cookieService: CookieService,
		private sidebarServices:SidebarMenuService,
		private router: Router) {}
	
		
		ngOnInit(): void {
			this.data$ = this.sidebarServices.getData();
			this.reload();
		}
		
		reload() {
			this.data$ = this.sidebarServices.getData();
		}
		
		isLogin() {
			return this.cookieService.check('access');
		}
	}
