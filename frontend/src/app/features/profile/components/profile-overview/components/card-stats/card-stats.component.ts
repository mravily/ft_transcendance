import { Component, Input, OnInit } from '@angular/core';
import { IAccount } from 'src/app/model/user.model';

@Component({
  selector: 'app-card-stats',
  templateUrl: './card-stats.component.html',
  styleUrls: ['./card-stats.component.scss']
})
export class CardStatsComponent implements OnInit {

  @Input() data!: IAccount;

  constructor() {}

  ngOnInit(): void {
  }

}
