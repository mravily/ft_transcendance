import { Component, Input, OnInit } from '@angular/core';
import { ShortListContact } from '../../model/sidebar.model';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {

  @Input() contact!: ShortListContact;
	
  constructor() { }

  ngOnInit(): void {
  }

}