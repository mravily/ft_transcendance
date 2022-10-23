import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IAccount } from 'src/app/model/user.model';
import { PongService } from '../../services/pong.service';
import { PongMatch } from './PongMatch.class';

// enum KeyBindings{
//   UP = 38,
//   DOWN = 40
// }

@Component({
  selector: 'app-pong',
  templateUrl: './pong.component.html',
  styleUrls: ['./pong.component.scss'],
  providers: [PongService]
})
export class PongComponent implements OnInit, AfterViewInit, OnDestroy {
  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    if (event.key != "ArrowUp" && event.key != "ArrowDown")
      return;
    if(event.key == "ArrowUp"){
      PongMatch.upIsPressed = true;
    }else if (event.key == "ArrowDown"){
      PongMatch.downIsPressed = true;
    }
    if (this.game instanceof PongMatch) {
      this.game.update_direction();
    }
  }
  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    if (event.key != "ArrowUp" && event.key != "ArrowDown")
      return;
    if(event.key == "ArrowUp"){
      PongMatch.upIsPressed = false;
    }else if (event.key == "ArrowDown"){
      PongMatch.downIsPressed = false;
    }
    if (!this.isSpec) {
      this.game.update_direction();
    }
  }
  @ViewChild('canvas')
  gameCanvas!: ElementRef<HTMLCanvasElement>;
  subs: Subscription[] = [];

  gameId: number;
  private game!: PongMatch;
  isSpec: boolean = false;

  players: IAccount[] = [];

  constructor(private route: ActivatedRoute, private pongService: PongService, private router: Router) {
    this.gameId = this.route.snapshot.params["gameId"];
  }
  ngOnInit(): void {
    this.subs.push(this.pongService.specModeEvent.subscribe(() => {
      console.log("spec mode");
      this.isSpec = true;
      this.game.turnOnSpecMode();
    }));
    this.subs.push(this.pongService.redirectToLobbyEvent.subscribe(() => {
      this.router.navigate(["/play"]);
    }));
    this.subs.push(this.pongService.matchUsersEvent.subscribe((users: IAccount[]) => {
      console.log("users", users);
      this.players = users;
    }));
  }
  
  ngAfterViewInit(): void {
    this.game = new PongMatch(this.gameId, this.pongService, this.gameCanvas);
    // console.log(this.game);
    
    this.game.ready();
  }

  ready() {
    this.game.ready();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
