import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageI } from '../models/chat.model';
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
  messages: MessageI[] = [
  ];

  constructor(private chats: ChatService) { }
  
  onSendMessage() {
    this.chats.sendMessage(this.curMessage);
    this.messages.push({user: "me",
                      text: this.curMessage,
                      channel : this.selectedContact, 
                      createdAt: new Date(),
                     }); // suppr
    this.curMessage = "";
  }
  
  onContactClick(contact: string) {
    this.selectedContact = contact;
  }

  ngOnInit(): void {
    this.chats.getAddedMessage().subscribe((message: MessageI) => {
      this.messages.push(message);
    });
    this.chats.getMessagesObs().subscribe((messages: MessageI[]) => {
      this.messages = messages;
    });
    this.chats.getChannelsObs().subscribe((rooms: any[]) => {
      this.contacts = rooms;
    });

  }


  ngAfterViewChecked() {
    this.mContainer.nativeElement.scrollTop = this.mContainer.nativeElement.scrollHeight;
  }

}
