import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { IAccount } from 'src/app/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class SidebarMenuService {
	
	constructor(private http: HttpClient,
				private cookieService: CookieService) { }

	getData(): Observable<IAccount> {
	  return this.http.get<IAccount>("api/sidebar");
	}

	signOut() {
		this.http.get('api/auth/sign-out');
		this.cookieService.deleteAll();
	}
}
