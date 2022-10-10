import { Component, OnInit } from '@angular/core';
import { TfaService } from 'src/app/features/tfa.service';

@Component({
  selector: 'app-qrcode-view',
  templateUrl: './qrcode-view.component.html',
  styleUrls: ['./qrcode-view.component.scss']
})
export class QrcodeViewComponent implements OnInit {

	tfa!: any;
  	constructor(private tfaServices: TfaService) { }

  	ngOnInit(): void {
		this.tfaServices.getAuth().subscribe((data) => this.tfa = data);
  	}

}
