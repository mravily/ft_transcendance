import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IAccount } from 'src/app/model/user.model';
import { ProfileService } from '../../services/profile.service';


@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {

  settingsForm!: FormGroup
  user$!: Observable<IAccount>
  urlRegex!: RegExp;
  selectedFile!: File

  constructor(private profileService: ProfileService,
			  private formBuilder: FormBuilder) { }

	initForm() {
		this.user$ = this.profileService.getPrivateProfile()
		this.user$.subscribe(v => {
			this.settingsForm = this.formBuilder.group({
				firstName: [v.firstName],
				lastName: [v.lastName],
				email: [v.email, [Validators.pattern(this.urlRegex)]],
				login: [v.login],
				nickname: [v.nickName],
			});
		});
	}

	ngOnInit(): void {
		this.initForm();
	} 
	
	uploadFile(event: any) {
		this.selectedFile = event.target.files[0];
	}

	onSubmitForm() {
		if (this.selectedFile)
			this.profileService.upload(this.selectedFile);
		this.profileService.sendForm(this.settingsForm);
		this.initForm();
	}
}
