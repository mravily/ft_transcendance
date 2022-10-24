import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { IAccount } from 'src/app/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  initSocket(): Socket {
	return new Socket({ url: '/leaderboard', options: {
		withCredentials: false,
	  } });
  }

  getDataTop10(socket: Socket): Observable<IAccount[]> {
	socket.emit('top-ten');
	return socket.fromEvent<IAccount[]>('top-ten');
  }

  getAllUsers(socket: Socket): Observable<IAccount[]> {
	socket.emit('allUsers');
	return socket.fromEvent<IAccount[]>('allUsers');
  }

  disconnectSocket(socket: Socket): void {
	socket.disconnect();
  }
}
