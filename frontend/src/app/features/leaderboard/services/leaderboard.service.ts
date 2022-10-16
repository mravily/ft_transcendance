import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAccount } from 'src/app/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  constructor(private http: HttpClient) { }

  getTopTen(): Observable<IAccount[]> {
	return this.http.get<IAccount[]>("api/leaderboard");
  }

  getAllUsers(): Observable<IAccount[]> {
	return this.http.get<IAccount[]>("api/leaderboard/all")
  }
}
