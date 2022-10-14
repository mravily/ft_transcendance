import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import b64toBlob from 'b64-to-blob';
import { first } from 'rxjs';
import { Profile } from '../../models/profile.user.model';
import { ProfileService } from '../../services/profile.service';


@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {

  settingsForm!: FormGroup;
  user$!: Profile;
  urlRegex!: RegExp;
  file!: File;
  myForm = new FormGroup({
	file: new FormControl('', [Validators.required]),
	fileSource: new FormControl('', {validators: [Validators.required]})
  });

  constructor(
	private http: HttpClient,
	private profileService: ProfileService,
	private formBuilder: FormBuilder) { }

	
	ngOnInit(): void {
		this.user$ = {
			firstName: 'Medhi',
			lastName: 'Ravily',
			email: 'mravily@student.42.fr',
			login: 'mravily',
			displayName: 'Medhi Ravily',
			avatar: 'https://cdn.intra.42.fr/users/mravily.jpg'
		}
		
		this.settingsForm = this.formBuilder.group({
			firstName: [this.user$.firstName],
			lastName: [this.user$.lastName],
			email: [this.user$.email, [Validators.required, Validators.pattern(this.urlRegex)]],
			login: [this.user$.login],
			nickname: [this.user$.displayName],
			srcFile: new FormControl('', {validators: [Validators.required]})
		});
	} 
	
	uploadFile(event: any) {
		this.file = event.target.files[0];
		// this.myForm.patchValue({ fileSource: file });
		// this.myForm.get('fileSource')!.updateValueAndValidity();
	// 	this.settingsForm.patchValue({
	// 	  srcFile: file,
	// 	});
	// 	this.settingsForm.get('srcFile')!.updateValueAndValidity();
	}

	onSubmitForm() {
		// const file: string | Blob = this.settingsForm.get('srcFile')!.value;
		// const file = this.myForm.get('fileSource')!.value;
		// let blob = b64toBlob(this.settingsForm.get('srcFile')!.value, 'image/jpeg')//fil.mimetype)
		// this.profileService.upload(file);
		const fileData = new FormData(); 
		fileData.append('file', this.file);
		// fileData.append('file', this.settingsForm.get('srcFile')!.value);
		this.http.post('api/upload', fileData).subscribe({
			next: (response) => console.log(response),
			error: (error) => console.log(error),
			});
		// this.profileService.sendForm(this.settingsForm);
	}
}
