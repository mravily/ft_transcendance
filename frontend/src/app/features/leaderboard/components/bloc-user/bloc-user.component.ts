import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/features/leaderboard/model/user.model';

@Component({
  selector: 'app-bloc-user',
  templateUrl: './bloc-user.component.html',
  styleUrls: ['./bloc-user.component.css']
})
export class BlocUserComponent implements OnInit {

  @Input() user!: User;
  @Input() rank!: number;

  constructor() { }

  ngOnInit(): void {
  }

}
