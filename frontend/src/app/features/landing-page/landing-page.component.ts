import { AfterViewInit, Component, OnInit } from '@angular/core';
declare var anime: any;  

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})

export class LandingPageComponent implements AfterViewInit {

  	constructor() {}

	ngAfterViewInit(): void {
		anime.timeline({ loop: true })
		.add({
			target: '#btn',
			top: '100px',
			duration: 500,
			easing: ''
		})
	  }

	onPLay() {

	}
}

