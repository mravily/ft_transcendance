import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TfaService {

  constructor(private http: HttpClient) { }
  
	getAuth(): Observable<any> {
		return this.http.post('api/tfa/generate', { observe: 'response' });
	}

	verifyAuth(token: any): Observable<boolean> {
		return this.http.post<boolean>("api/tfa/authenticate", { token });
	}

}
