import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { IAccount } from 'src/app/model/user.model';
import { Socket } from 'ngx-socket-io';

@Injectable({providedIn: 'root'})
export class SidebarMenuService {
	socket!: Socket;
	data!: Observable<IAccount>;
	
	constructor(private http: HttpClient,
				private cookieService: CookieService) {
					this.socket = new Socket({
						url: '/sidebar',
						options: {
							withCredentials: false,
						}
					});
					this.socket.emit('event');
					this.data = this.socket.fromEvent<IAccount>('event');
				}

	getData() {
		this.socket.emit('event');
		// this.data = this.socket.fromEvent<IAccount>('event');
	}

	signOut() {
		this.http.get('api/auth/sign-out').subscribe();
		this.cookieService.deleteAll();
	}
}
