import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

	cookie!: any;
	constructor (private cookieService: CookieService,
				 private router: Router) {}
	
  canActivate(): boolean {
		if (this.cookieService.getAll()) {
			return true;
		} else {
			this.router.navigateByUrl('/sign-in');
			return false;
		}
  }
  
}
