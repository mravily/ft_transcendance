import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

	constructor (private cookieService: CookieService,
				 private router: Router) {}
 
  canActivate(): boolean {
		if (this.cookieService.check('access')) {
			return true;
		} else {
			this.router.navigateByUrl('/sign-in');
			return false;
		}
  }
}
