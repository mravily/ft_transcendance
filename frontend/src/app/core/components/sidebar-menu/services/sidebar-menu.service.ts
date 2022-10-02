import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SideBarData } from '../model/sidebar.model';

@Injectable({
  providedIn: 'root'
})
export class SidebarMenuService {
	
	constructor(private http: HttpClient) { }

	getData(): Observable<SideBarData> {
	  return this.http.get<SideBarData>("api/sidebar");
	}
}
