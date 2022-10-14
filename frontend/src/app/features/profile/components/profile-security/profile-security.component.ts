import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TfaService } from 'src/app/features/tfa.service';

@Component({
  selector: 'app-profile-security',
  templateUrl: './profile-security.component.html',
  styleUrls: ['./profile-security.component.scss']
})
export class ProfileSecurityComponent implements OnInit {

	// isActivated$!: Observable<boolean>
	// alreadySet$!: Observable<string>
	isActivated!: boolean
	alreadySet!: string
	setup: boolean = false
	
  	constructor(private tfaService: TfaService) {
		this.tfaService.isActivated().subscribe(v => this.isActivated = v);
		this.tfaService.getSecret().subscribe(v => this.alreadySet = v);
		console.log('already-set-1', this.alreadySet);
	}

  	ngOnInit(): void {
		this.tfaService.isActivated().subscribe(v => this.isActivated = v);
		this.tfaService.getSecret().subscribe(v => this.alreadySet = v);
		console.log('already-set-2', this.alreadySet);
  	}

	onClickSwitch() {
		this.tfaService.switch2FA();
	}

	onSetup() {
		if (!this.setup)
			this.setup = true;
		else
			this.setup = false;
	}
}
