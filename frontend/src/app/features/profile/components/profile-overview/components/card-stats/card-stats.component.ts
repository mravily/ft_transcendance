import { Component, Input, OnInit } from '@angular/core';
import { CardStats } from 'src/app/features/profile/models/profile.user.model';

@Component({
  selector: 'app-card-stats',
  templateUrl: './card-stats.component.html',
  styleUrls: ['./card-stats.component.scss']
})
export class CardStatsComponent implements OnInit {

  @Input() data!: CardStats;

  constructor() {}

  ngOnInit(): void {
  }

}
