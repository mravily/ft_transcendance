import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PongService } from '../../services/pong.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  userEmail!: string;

  @ViewChild('findMatch')
  findMatchButton!: ElementRef<HTMLButtonElement>;

  buttonText: string = "Trouver un adversaire";
  constructor(private router: Router, private pongServ: PongService) { }

  ngOnInit(): void {
  }

  onMatchmaking() {
    this.findMatchButton.nativeElement.disabled = true;
    this.buttonText = "Recherche en cours...";
    
    this.pongServ.getNewMatchmaking();
    this.pongServ.gameFoundEvent.subscribe((id: number) => {
      this.router.navigateByUrl('/pong/' + id);
    });
  }

  onSubmitForm(ngform: NgForm) {
    console.log(this.userEmail);
  }
}
