import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../models/chat.models';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @ViewChild("messageContainer")
  mContainer!: ElementRef;

  create: boolean = false;

  contacts: string[] = ["John Potter", "Jane McGiller", "Joe Froster", "Jill Smith", "Jenny Smith", "Henry Colmard", "Stuart Little", "John Doe", "Jane Doe", "Joe Doe", "Jill Doe", "Jenny Doe", "Henry Doe", "Stuart Doe"];
  selectedContact: string = this.contacts[0];
  curMessage!: string;
  messages: Message[] = [
  ];

  constructor(private chats: ChatService) { }
  
  onSendMessage() {
    this.chats.sendMessage(this.curMessage);
    this.messages.push({sender: "me", body: this.curMessage}); // suppr
    this.curMessage = "";
  }
  
  onContactClick(contact: string) {
    this.selectedContact = contact;
    this.messages.push({sender: contact, body: "Hello"});
  }

  ngOnInit(): void {
    this.chats.getAddedMessage().subscribe((message: Message) => {
      this.messages.push(message);
    });
    this.chats.getMessages().subscribe((messages: Message[]) => {
      this.messages = messages;
    });
    this.chats.getMyRooms().subscribe((rooms: any[]) => {
      this.contacts = rooms;
    });

  }


  ngAfterViewChecked() {
    this.mContainer.nativeElement.scrollTop = this.mContainer.nativeElement.scrollHeight;
  }

}
