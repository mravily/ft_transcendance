import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAccount } from 'src/app/model/user.model';

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

	getSecret(): Observable<IAccount> {
		return this.http.get<IAccount>('api/tfa/secret');
	}

	get2FA(): Observable<IAccount> {
		return this.http.get<IAccount>('api/tfa/get2fa');
	}

	switch2FA() {
		this.http.get('api/tfa/switch');
	}

	delete2FA(): void {
		this.http.post('api/tfa/delete', { observe: 'response' });
	}
}
