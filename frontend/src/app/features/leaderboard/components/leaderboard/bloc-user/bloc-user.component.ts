import { Component, Input, OnInit } from '@angular/core';
import { IAccount } from 'src/app/model/user.model';

@Component({
  selector: 'app-bloc-user',
  templateUrl: './bloc-user.component.html',
  styleUrls: ['./bloc-user.component.css']
})
export class BlocUserComponent implements OnInit {

  @Input() user!: IAccount;
  @Input() rank!: number;

  constructor() { }

  ngOnInit(): void {
  }

}
