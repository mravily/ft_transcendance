import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProfileOverview } from '../models/profile.user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
    
  constructor(private http: HttpClient) { }
  
  upload(file: any) {
	console.log('file', file);
  	// if (!file){
		const fileData = new FormData(); 
		fileData.append('file', file, file.name);
		this.http.post('api/upload', fileData).subscribe({
			next: (response) => console.log(response),
			error: (error) => console.log(error),
			});;
		console.log('out');
	// }
  }

  sendForm(settingsForm: FormGroup) {
	var formData: any = new FormData();

	formData.append('firstName', settingsForm.get('firstName')!.value);
	formData.append('lastName', settingsForm.get('lastName')!.value);
	formData.append('email', settingsForm.get('email')!.value);
	formData.append('login', settingsForm.get('login')!.value);
	formData.append('nickname', settingsForm.get('nickname')!.value);

	this.http
		.post('api/update', formData)
		.subscribe({
		next: (response) => console.log(response),
		error: (error) => console.log(error),
		});
  }

  getOverview() : Observable<ProfileOverview> {
	return this.http.get<ProfileOverview>('api/overview');
  }

}
