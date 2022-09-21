import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

	cookie!: any;
	constructor (
		private cookieService: CookieService,
		private router: Router) {
			this.cookie = this.cookieService.get('token');
		}
	
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
	): boolean {
		if (this.cookie) {
			return true;
		} else {
			window.location.href="http://localhost:3000/api/auth/42";
			return false;
		}
  }
  
}
