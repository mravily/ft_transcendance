import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import * as e from 'express';
import { response } from 'express';
import { CookieService } from 'ngx-cookie-service';
import { async, catchError, filter, Observable, of, tap, throwError } from 'rxjs';
import { TfaService } from './services/tfa.service';


@Component({
	selector: 'app-tfa',
	templateUrl: './tfa.component.html',
	styleUrls: ['./tfa.component.scss']
})
export class TfaComponent implements OnInit {

	title = 'otp-app';
	otp!: string;
	inputDigitLeft: string = "Verify code";
	btnStatus: string = "btn-light";

	public configOptions = {
		length: 6,
		inputClass: 'digit-otp',
		containerClass: 'd-flex justify-content-between'
	}

	constructor(private tfaServices: TfaService, private router: Router) { }

	ngOnInit() {
	}

	onOtpChange(event: any) {
		this.otp = event;
		if (this.otp.length < this.configOptions.length) {
			this.inputDigitLeft = this.configOptions.length - this.otp.length + " digits Left";
			this.btnStatus = 'btn-light';
		}

		if (this.otp.length == this.configOptions.length) {
			this.inputDigitLeft = "Let's go!";
			this.btnStatus = 'btn-primary';
		}
	}

	previousUrl!: string;
	isValid!: boolean;
	onSubmit() {

		const token = this.otp;
		this.tfaServices.verifyAuth(token).subscribe(v => this.isValid = v);
		console.log('isValid', this.isValid);
		if (this.isValid)
			this.router.navigateByUrl(this.previousUrl);
	}

	ngOnDestroy() {
		// this.subscription.unsubscribe();
	}
}
