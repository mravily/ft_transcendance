import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SocketAddress } from 'net';
import { Socket } from 'ngx-socket-io';
import { Observable, of } from 'rxjs';
import { IAccount } from 'src/app/model/user.model';
import { IProfileFriends } from '../models/profile.user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  upload(file: any) {
		let fileData = new FormData();
		fileData.append('file', file);
		this.http.post('api/upload', fileData).subscribe({
			// next: (response) => console.log(response),
			// error: (error) => console.log(error),
			});
  }

  sendForm(settingsForm: FormGroup, socket: Socket): Observable<IAccount> {
    socket.emit('update', {
      	firstName: settingsForm.get('firstName')!.value,
      	lastName: settingsForm.get('lastName')!.value,
      	email: settingsForm.get('email')!.value,
      	login: settingsForm.get('login')!.value,
      	nickName: settingsForm.get('nickname')!.value,
      });
      return socket.fromEvent<IAccount>('update');
  }

  getOverview(): Observable<IAccount> {
	return this.http.get<IAccount>('api/profile/overview');
  }

  getPublicProfile(login: string): Observable<IAccount> {
	return this.http.get<IAccount>('api/profile/' + login);
  }

  getPrivateProfile(socket: Socket) {
    socket.emit('settings');
    return socket.fromEvent<IAccount>('settings');
    // return this.data$;
  }

  initSocket(): Socket {
    return new Socket({url: '/profile', options: {withCredentials: false}});
  }

  sendFriendRequest(login: string) {
	this.http.post('api/user/friendrequest', { login }).subscribe();
  }

  blockUser(login: string) {
	this.http.post('api/user/block', { login }).subscribe();
  }

  unBlockUser(login: string) {
	this.http.post('api/user/unblock', { login }).subscribe();
  }

  isBlocked(login: string) {
	return this.http.post('api/profile/isblocked', { login });
  }

  isUser(login: string) {
	return this.http.post('api/user/isuser', { login });
  }
  getProfileFriends(): Observable<IProfileFriends[]> {
	return this.http.get<IProfileFriends[]>('api/profile/friends');
  }

  isMyProfile(login: string): Observable<boolean> {
	return this.http.post<boolean>('api/profile/ismypage', { login })
  }

  getBlockedUser(): Observable<IAccount[]> {
	return this.http.get<IAccount[]>('api/profile/blockedusers');
  }

  acceptFriendRequest(login: string) {
	this.http.post('api/user/acceptfriend', { login }).subscribe();
  }

  removeFriend(login: string) {
	this.http.post('api/user/deletefriend',  { login }).subscribe();
  }

  isFriend(login: string): Observable<[boolean, boolean]> {
	return this.http.post<[boolean, boolean]>('api/profile/isfriend', { login });
  }
}
