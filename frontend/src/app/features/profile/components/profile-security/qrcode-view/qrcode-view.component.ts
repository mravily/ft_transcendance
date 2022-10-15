import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { TfaService } from 'src/app/features/tfa/services/tfa.service';
import { tfa } from '../../../models/profile.user.model';

@Component({
  selector: 'app-qrcode-view',
  templateUrl: './qrcode-view.component.html',
  styleUrls: ['./qrcode-view.component.scss']
})
export class QrcodeViewComponent implements OnInit {

	@Input() alreadySet!: any;
	tfa$!: Observable<tfa>;
  	constructor(private tfaServices: TfaService,
				private sanitizer: DomSanitizer) { }

  	ngOnInit(): void {
		if (!this.alreadySet) this.tfa$ = this.tfaServices.generate();
		else this.tfa$ = this.tfaServices.get2FA();
  	}

	onDelete2FA() {
		this.tfaServices.delete2FA();
	}
}
