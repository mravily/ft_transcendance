import { Component, Input, OnInit } from '@angular/core';
import { ShortProfile } from '../../model/sidebar.model';

@Component({
  selector: 'app-profile-button',
  templateUrl: './profile-button.component.html',
  styleUrls: ['./profile-button.component.scss']
})
export class ProfileButtonComponent implements OnInit {

  @Input() profile!: ShortProfile;
  
  constructor() { }

  ngOnInit(): void {
  }

}
