import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { PongService } from '../../services/pong.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  searchUser!: string;

  @ViewChild('findMatch')
  findMatchButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('findPUMatch')
  findPUMatchButton!: ElementRef<HTMLButtonElement>;

  buttonText: string = "Find Opponent";
  PUbuttonText: string = "Find Opponent";
  friends: any[];
  searchForm!: FormGroup;
  searchResult$!: Observable<string>;
  searchSubcription!: Subscription;

  constructor(private router: Router,
              private pongServ: PongService,
              private formBuilder: FormBuilder) { 
    this.friends = [
      {name: "noob", ratio: 0.25, imgUrl : "https://www.w3schools.com/howto/img_avatar.png"},
      {name: "Jane", ratio: 0.75, imgUrl : "https://www.w3schools.com/howto/img_avatar.png"},
      {name: "Jack", ratio: 0.75, imgUrl : "https://www.w3schools.com/howto/img_avatar.png"},
    ];
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
        search: [null]
    });
    this.searchSubcription = this.searchForm.valueChanges.pipe(
      map((form) => form.search)
    ).subscribe((search) => {
      // this.searchResult = api.getSearch();
    });
  }
  ngOnDestroy() {
    this.searchSubcription.unsubscribe();
  }
  onMatchmaking() {
    this.findMatchButton.nativeElement.disabled = true;
    this.buttonText = "Searching...";
    
    this.pongServ.getNewMatchmaking();
    this.pongServ.gameFoundEvent.subscribe((id: number) => {
      this.router.navigateByUrl('/play/' + id);
    });
  }
  onPUMatchmaking() {
    this.findPUMatchButton.nativeElement.disabled = true;
    this.PUbuttonText = "Searching...";
    
    this.pongServ.getNewPUMatchmaking();
    this.pongServ.gameFoundEvent.subscribe((id: number) => {
      this.router.navigateByUrl('/play/' + id);
    });
  }
  onInvite(user: any) {
    this.pongServ.invitePlayer(user.id);
  }
}
