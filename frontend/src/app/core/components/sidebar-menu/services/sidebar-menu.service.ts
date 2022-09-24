import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShortListContact } from '../model/sidebar.model';

@Injectable({
  providedIn: 'root'
})
export class SidebarMenuService {
	
	constructor(private http: HttpClient) { }

	getList(): Observable<ShortListContact[]> {
	  return this.http.get<ShortListContact[]>("api/short-list");
	}
}
