import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/features/leaderboard/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  constructor(private http: HttpClient) { }

  getTopTen(): Observable<User[]> {
	return this.http.get<User[]>("api/leaderboard");
  }

  getAllUsers(): Observable<User[]> {
	return this.http.get<User[]>("api/leaderboard/all")
  }
}
