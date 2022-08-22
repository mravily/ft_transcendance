import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';


export interface lolI {
	title: string;
}

export interface post {
	id: number;
	title: string;
	content: string;
}

export interface user {
	id: number;
	email: string;
	name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) {}

  getTest(): Observable<lolI> {
	return this.http.get<lolI>('/api');
  }

  sendUser(usr: user): Observable<user> {
	return this.http.post<user>('user', usr);
  }

  
}
