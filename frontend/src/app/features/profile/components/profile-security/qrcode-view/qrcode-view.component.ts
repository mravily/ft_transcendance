import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TfaService } from 'src/app/features/tfa.service';
import { tfa } from '../../../models/profile.user.model';

@Component({
  selector: 'app-qrcode-view',
  templateUrl: './qrcode-view.component.html',
  styleUrls: ['./qrcode-view.component.scss']
})
export class QrcodeViewComponent implements OnInit {

	@Input() alreadySet!: string;
	tfa$!: Observable<tfa>;
  	constructor(private tfaServices: TfaService) { }

  	ngOnInit(): void {
		console.log('alreadySet', this.alreadySet)
		if (!this.alreadySet) this.tfa$ = this.tfaServices.generate();
		else this.tfa$ = this.tfaServices.get2FA();
		// console.log('tfa', this.tfa$.secret);
  	}

}
