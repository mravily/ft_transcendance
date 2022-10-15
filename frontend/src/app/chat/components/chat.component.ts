import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, Observable, Subscription } from 'rxjs';
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

  contacts!: Observable<IChannel[]>;
  selectedChannel!: IChannel;
  curMessage!: string;
  // newMemberLogin!: string;
  newPassword!: string;
  myUser!: IAccount;
  searchForm!: FormGroup;
  userSearchResult$!: Observable<string[]>;
  searchSubcription!: Subscription;

  constructor(private chatServ: ChatService, private builder: FormBuilder) { }
  
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
      if (this.selectedChannel?.messages)
        tmp = this.selectedChannel.messages;
      this.selectedChannel = channel;
      this.selectedChannel.messages = tmp;
      this.create = false;
    });
    this.chatServ.getChannelUpdateObs().subscribe((channel: IChannel) => {
      // console.log(channel);
      if (this.selectedChannel && this.selectedChannel.channelName == channel.channelName)  {
        let tmp!: IMessage[];
        if (this.selectedChannel?.messages)
          tmp = this.selectedChannel.messages;
        this.selectedChannel = channel;
        this.selectedChannel.messages = tmp;
      }
    });
    this.contacts = this.chatServ.getChannelsObs().pipe(
      map((channels: IChannel[]) => 
        channels.map((channel: IChannel) => {
          channel.imgUrl = this.getRoomPhoto(channel);
          channel.realName = this.getRealName(channel);
          console.log(channel.realName, channel.imgUrl);
          return channel;
        })
      )
    );
    this.chatServ.getBlockersObs().subscribe((blockers: string[]) => {
      this.myUser.blockedFrom = blockers;
    });
    this.chatServ.getErrorObs().subscribe((error: string) => {
      console.log(error);
    });
    this.chatServ.getMyUserObs().subscribe((user: IAccount) => {
      this.myUser = user;
    });

    this.searchForm = this.builder.group({
      search: [null]
    });
    this.searchSubcription = this.searchForm.valueChanges.pipe(
      map((form) => form.search)
    ).subscribe((search) => {
      this.chatServ.searchUsers(search);
    });
    this.userSearchResult$ = this.chatServ.getSearchUsersObs();
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
  isMuted(login: string): boolean {
    if (this.selectedChannel && this.selectedChannel.mutedUsers) {
      return this.selectedChannel.mutedUsers.map((user) => user.login).includes(login);
    }
    if (this.selectedChannel && this.selectedChannel.isDirect) {
      let other = this.selectedChannel.users?.find((user) => user.login != this.myUser.login)?.login;
      if (other && this.myUser.blockedFrom) {
        return this.myUser.blockedFrom?.includes(other);
      }
    }
    return false;
  }
  isBlocked(login: string | undefined) {
    if (this.myUser && this.myUser.blockUsers && login) {
      return this.myUser.blockUsers.includes(login);
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
    this.create = false;
    this.chatServ.getChannelInfo(contact);
    this.chatServ.getMessages(contact);
  }
  onDMclick(login: string) {
    this.create = false;
    this.selectedChannel.messages = undefined;
    this.chatServ.getDMinfo(login);
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
  onAddMember(login: string) {
    this.chatServ.addMember(this.selectedChannel.channelName, login);
    // this.newMemberLogin = "";
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
  getRealName(room: IChannel) {
    if (!room.isDirect) {
      return room.channelName;
    }
    console.log(room.users?.find((user) => user.login != this.myUser.login)?.nickName);
    return room.users?.find((user) => user.login != this.myUser.login)?.nickName;
  }
  getRoomPhoto(room: IChannel) {
    if (!room.isDirect)
      return "https://cdn-icons-png.flaticon.com/512/57/57269.png";
    return room.users?.find((user) => user.login != this.myUser.login)?.avatar;
  }
  onBlock(login: string) {
    this.chatServ.blockUser(login);
  }
  onUnblock(login: string) {
    this.chatServ.unblockUser(login);
  }
}
