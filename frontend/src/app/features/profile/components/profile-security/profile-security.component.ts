import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TfaService } from 'src/app/features/tfa/services/tfa.service';
import { IAccount } from 'src/app/model/user.model';

@Component({
  selector: 'app-profile-security',
  templateUrl: './profile-security.component.html',
  styleUrls: ['./profile-security.component.scss']
})
export class ProfileSecurityComponent implements OnInit {

	isActivated$!: Observable<boolean>
	alreadySet$!: Observable<IAccount>
	setup: boolean = false
	
  	constructor(private tfaService: TfaService) {
		this.alreadySet$ = this.tfaService.getSecret();
	}

  	ngOnInit(): void {
		this.alreadySet$ = this.tfaService.getSecret();
  	}

	onClickSwitch() {
		this.tfaService.switch2FA();
	}

	changeSetup(value: boolean) {
		this.setup = value;
	}
	
	onSetup() {
		this.alreadySet$ = this.tfaService.getSecret();
		if (!this.setup)
			this.setup = true;
		else
			this.setup = false;
	}
}
