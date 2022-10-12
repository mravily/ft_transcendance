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

	isActivated$!: Observable<boolean>
	alreadySet$!: Observable<string>
	isActivated!: boolean
	alreadySet!: string
	
  	constructor(private tfaService: TfaService) {

	}

  	ngOnInit(): void {
		this.isActivated$ = this.tfaService.isActivated();
		this.alreadySet$ = this.tfaService.getSecret()
  	}

	onClickSwitch() {
		this.tfaService.switch2FA();
	}

	onSetup() {
		this.alreadySet$.subscribe(v => this.alreadySet = v);
		
	}
}
