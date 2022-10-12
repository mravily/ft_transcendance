import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IAccount, IChannel, IMessage } from '../../interfaces';
// import { channelI } from '../models/channel.model';
// import { MessageI } from '../models/chat.model';
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
  selectedChannel!: IChannel;
  curMessage!: string;
  newMemberLogin!: string;
  newPassword!: string;
  myUser!: IAccount;

  constructor(private chatServ: ChatService) { }
  
  ngOnInit(): void {
    this.chatServ.getAddedMessageObs().subscribe((message: IMessage) => {
      if (this.selectedChannel && this.selectedChannel.messages &&
          message.channelId == this.selectedChannel.channelName) {
        this.selectedChannel.messages.push(message);
      }
    });
    this.chatServ.getMessagesObs().subscribe((messages: IMessage[]) => {
      if (this.selectedChannel && messages[0].channelId == this.selectedChannel.channelName)
        this.selectedChannel.messages = messages;
    });
    this.chatServ.getChannelInfoObs().subscribe((channel: IChannel) => {
      let tmp!: IMessage[];
      if (channel.messages)
        tmp = channel.messages;
      this.selectedChannel = channel;
      channel.messages = tmp;
    });
    this.chatServ.getChannelUpdateObs().subscribe((channel: IChannel) => {
      // console.log(channel);
      if (this.selectedChannel && this.selectedChannel.channelName == channel.channelName)  {
        let tmp!: IMessage[];
        if (channel.messages)
          tmp = channel.messages;
        this.selectedChannel = channel;
        channel.messages = tmp;
      }
    });
    this.chatServ.getChannelsObs().subscribe((rooms: IChannel[]) => {
      this.contacts = rooms.map((room) => room.channelName);
    });
    this.chatServ.getErrorObs().subscribe((error: string) => {
      console.log(error);
    });
    this.chatServ.getMyUserObs().subscribe((user: IAccount) => {
      this.myUser = user;
    });
  }

  ngAfterViewChecked() {
    if (this.mContainer) {
      this.mContainer.nativeElement.scrollTop = this.mContainer.nativeElement.scrollHeight;
    }
  }

  amICreator() {
    if (this.selectedChannel && this.myUser)
      return this.selectedChannel.creator == this.myUser.login;
    return false;
  }
  isAdmin(login: string) {
    if (this.selectedChannel && this.selectedChannel.admins) {
      return this.selectedChannel.admins.map((user) => user.login).includes(login);
    }
    return false;
  }
  isMuted(login: string) {
    if (this.selectedChannel && this.selectedChannel.mutedUsers) {
      return this.selectedChannel.mutedUsers.map((user) => user.login).includes(login);
    }
    return false;
  }
  onSendMessage() {
    this.chatServ.sendMessage({
      message: this.curMessage,
      from: "me",
      channelId: this.selectedChannel.channelName,
      createdAt: new Date()
    });
    // this.messages.push({user: "me",
    //                   text: this.curMessage,
    //                   channel : this.selectedChannel.channelName, 
    //                   createdAt: new Date(),
    //                  }); // suppr
    this.curMessage = "";
  }
  
  onContactClick(contact: string) {
    this.chatServ.getChannelInfo(contact);
    this.chatServ.getMessages(contact);
    this.create = false;
  }
  onLeave() {
    this.chatServ.leaveChannel(this.selectedChannel.channelName);
    this.selectedChannel.messages = undefined;
  }
  onMute(login: string) {
    this.chatServ.muteUser(this.selectedChannel.channelName, login);
  }
  onUnmute(login: string) {
    this.chatServ.unmuteUser(this.selectedChannel.channelName, login);
  }
  onBan(login: string) {
    this.chatServ.banUser(this.selectedChannel.channelName, login);
  }
  onUnban(login: string) {
    this.chatServ.unbanUser(this.selectedChannel.channelName, login);
  }
  onPromote(login: string) {
    this.chatServ.promoteUser(this.selectedChannel.channelName, login);
  }
  onAddMember() {
    this.chatServ.addMember(this.selectedChannel.channelName, this.newMemberLogin);
    this.newMemberLogin = "";
  }
  onRemove(login: string) {
    this.chatServ.removeMember(this.selectedChannel.channelName, login);
  }
  onUpdatePassword() {
    this.chatServ.setPassword(this.selectedChannel.channelName, this.newPassword);
    this.newPassword = "";
  }
  onRemovePassword() {
    this.chatServ.removePassword(this.selectedChannel.channelName);
  }


}
