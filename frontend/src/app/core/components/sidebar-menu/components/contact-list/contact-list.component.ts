import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IAccount } from 'src/app/model/user.model';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {

  @Input() contact!: IAccount;
	
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  
  reload(route: string) {
	this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
		this.router.navigate([route]);
	}); 
  }
}
