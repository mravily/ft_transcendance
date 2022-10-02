import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
	private http: HttpClient,
	private profileService: ProfileService,
	private formBuilder: FormBuilder) { }

	onSubmitForm() {
		console.log(this.settingsForm.value);
	}

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
			displayName: [this.user$.displayName],
			formFile: [null]
	});
  }

}