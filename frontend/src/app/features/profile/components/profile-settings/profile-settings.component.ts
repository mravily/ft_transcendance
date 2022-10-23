import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
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
			  private formBuilder: FormBuilder,
			  private router: Router) {
				this.user$ = this.profileService.getPrivateProfile();
			  }

	initForm(user$: Observable<IAccount>) {
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
		this.user$ = this.profileService.getPrivateProfile();
		this.initForm(this.user$);
	} 
	
	uploadFile(event: any) {
		this.selectedFile = event.target.files[0];
	}

	onSubmitForm() {
		if (this.selectedFile)
			this.profileService.upload(this.selectedFile);
		this.profileService.sendForm(this.settingsForm);
		this.reload();
	}

	reload() {
		this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
			this.router.navigate(['/profile/settings']);
		}); 
	}
}
