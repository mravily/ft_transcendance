import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileOverview } from '../models/profile.user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
    
  constructor(private http: HttpClient) { }
  
  // Returns an observable
  upload(file: any): Observable<any> {
  
      // Create form data
      const formData = new FormData(); 
        
      // Store form name as "file" with file data
      formData.append("file", file, file.name);
        
      // Make http post request over api
      // with formData as req
      return this.http.post('api/upload', file)
  }

  getOverview() : Observable<ProfileOverview> {
	return this.http.get<ProfileOverview>('api/overview');
  }
}
