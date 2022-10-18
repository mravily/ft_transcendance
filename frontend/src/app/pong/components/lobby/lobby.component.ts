import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { IAccount } from 'src/app/model/user.model';
import { ChatService } from '../../../chat/services/chat.service';
import { PongService } from '../../services/pong.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit, OnDestroy {
  searchUser!: string;


  @ViewChild('findMatch')
  findMatchButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('findPUMatch')
  findPUMatchButton!: ElementRef<HTMLButtonElement>;

  buttonText: string = "Find Opponent";
  PUbuttonText: string = "Find Opponent";
  // friends: any[];
  searchForm!: FormGroup;
  searchResult$!: Observable<IAccount[]>;
  searchSubcription!: Subscription;

  constructor(private router: Router,
              private pongServ: PongService,
              private chatServ: ChatService,
              private formBuilder: FormBuilder) { 
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
        search: [null]
    });
    this.searchSubcription = this.searchForm.valueChanges.pipe(
      map((form) => form.search)
    ).subscribe((search) => {
      this.chatServ.searchUsers(search);
    });
    this.searchResult$ = this.chatServ.getSearchUsersObs();
    this.chatServ.getMatchFoundObs().subscribe((gameId: number) => {
      console.log('game found', gameId);
      this.router.navigate(['play', gameId]);
    });
    this.pongServ.gameFoundEvent.subscribe((id: number) => {
      this.router.navigateByUrl('/play/' + id);
    });
  }
  ngOnDestroy() {
    this.searchSubcription.unsubscribe();
  }
  onMatchmaking() {
    this.findMatchButton.nativeElement.disabled = true;
    this.buttonText = "Searching...";
    
    this.pongServ.getNewMatchmaking();
  }
  onPUMatchmaking() {
    this.findPUMatchButton.nativeElement.disabled = true;
    this.PUbuttonText = "Searching...";
    
    this.pongServ.getNewPUMatchmaking();
    this.pongServ.gameFoundEvent.subscribe((id: number) => {
      this.router.navigateByUrl('/play/' + id);
    });
  }
  onInvite(user: IAccount, powerup: boolean) {
    this.chatServ.inviteUser(user.login, powerup);
  }
}
