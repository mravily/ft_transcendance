import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/pong/models/chat.models';
import { PongService } from '../../../services/pong.service';

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
  
  constructor(private wss: PongService) { }

  onSendMessage() {
    this.wss.sendMessage(this.curMessage);
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
