import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Message } from '../../models/chat.models';
import { PongService } from '../../services/pong.service';
import { PongComponent } from '../pong/pong.component';

@Component({
  selector: 'app-gamechat',
  templateUrl: './gamechat.component.html',
  styleUrls: ['./gamechat.component.scss']
})
export class GamechatComponent implements OnInit {
  @ViewChild("messageContainer")
  mContainer!: ElementRef;

  curMessage!: string;
  messages: Message[] = [
  ];
  
  constructor(private wss: PongService, private comp: PongComponent) { }

  onSendMessage() {
    this.wss.sendMessage({gameId: this.comp.gameId, text: this.curMessage});
    this.curMessage = "";
  }

  ngOnInit(): void {
    this.wss.messageEvent.subscribe((message: Message) => {
      this.messages.push(message);
    });
  }

  ngAfterViewChecked() {
    this.mContainer.nativeElement.scrollTop = this.mContainer.nativeElement.scrollHeight;
  }

}
