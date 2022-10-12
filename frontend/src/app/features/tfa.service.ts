import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAccount } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class TfaService {

  constructor(private http: HttpClient) { }
  
	generate(): Observable<any> {
		return this.http.post('api/tfa/generate', { observe: 'response' });
	}

	verifyAuth(token: any): Observable<boolean> {
		return this.http.post<boolean>("api/tfa/authenticate", { token });
	}

	isActivated(): Observable<boolean> {
		return this.http.get<boolean>('api/tfa/switch');
	}

	getSecret(): Observable<string> {
		return this.http.get<string>('api/tfa/secret');
	}

	get2FA(): Observable<IAccount> {
		return this.http.get<IAccount>('api/tfa/get2fa');
	}
}
