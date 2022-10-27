import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, Subscription } from 'rxjs';
import { IChannel } from 'src/app/interfaces';
import { IAccount } from 'src/app/model/user.model';
import { ChatService } from '../../services/chat.service';
import { ChatComponent } from '../chat.component';

@Component({
  selector: 'app-newroom',
  templateUrl: './newroom.component.html',
  styleUrls: ['./newroom.component.scss']
})
export class NewroomComponent implements OnInit {

  roomForm!: FormGroup;
  ispublicSubcription!: Subscription | undefined;

  chanSearchForm!: FormGroup;
  chanSearchSubcription!: Subscription;
  publicChannels$: Observable<IChannel[]>;

  userSearchForm!: FormGroup;
  userSearchSubcription!: Subscription;
  users$: Observable<IAccount[]>;
  // password: string = "";

  constructor(private comp: ChatComponent, private builder: FormBuilder, private chatService: ChatService) {
    this.publicChannels$ = chatService.getPublicChannelsObs();
    this.users$ = chatService.getSearchUsersObs();
  }

  get myUser() {
    return this.comp.myUser;
  }
  amIonChan(channelName: string)
  {
    return this.comp.channels.map((chan) => chan.channelName).includes(channelName);
  }

  ngOnInit(): void {
    this.roomForm = this.builder.group({
      name: [null, [Validators.required]],
      // description: [null, []],
      members: this.builder.array([new FormControl()]),
      ispublic: [false, []],
      password: [{value: '', disabled: true}, ]
    })
    this.ispublicSubcription = this.roomForm.get('ispublic')?.valueChanges.subscribe((ispublic: boolean) => {
      if (ispublic) {
        this.roomForm.get('password')?.enable();
      } else {
        this.roomForm.get('password')?.disable();
      }
    });
    // this.addMemberSubcription = this.roomForm.get('members')?.valueChanges.subscribe((members: string[]) => {

    this.chanSearchForm = this.builder.group({
      search: [null]
    });
    this.chanSearchSubcription = this.chanSearchForm.valueChanges.pipe(
      map((form) => form.search)
    ).subscribe((search) => {
      this.chatService.searchPublicChannels(search);
    });
    this.userSearchForm = this.builder.group({
      search: [null]
    });
    this.userSearchSubcription = this.userSearchForm.valueChanges.pipe(
      map((form) => form.search)
    ).subscribe((search) => {
      this.chatService.searchUsers(search);
    });
    // this.chatService.getPublicChannels({page: 0, limit: 20});

  }
  ngOnDestroy() {
    this.chanSearchSubcription.unsubscribe();
    this.userSearchSubcription.unsubscribe();
    this.ispublicSubcription?.unsubscribe();
  }
  get members() {
    return this.roomForm.get('members') as FormArray;
  }
  addMember() {
    // const control = <FormArray>this.roomForm.controls['members'];
    this.members.push(new FormControl())
  }
  deleteMember() {
    // const control = <FormArray>this.roomForm.controls['members'];
    this.members.removeAt(this.members.length - 1);
  }
  onCreateChan()  {
    //console.log(this.roomForm.value);
    let chan: IChannel = {
      channelName: this.roomForm.value.name,
      // description: this.roomForm.value.description,
      users: this.roomForm.value.members.map((member: string) => { return {login: member} }),
      isPrivate: !this.roomForm.value.ispublic,
      isDirect: false,
      is_pwd: this.roomForm.value.password != null,
      password: this.roomForm.value.password,
      creator: "me", // only to compile, not necessary
    }
    this.chatService.createChannel(chan);
  }
  onJoin(channel: IChannel) {
    // console.log(channel.channelName, channel.password);
    this.chatService.joinChannel(channel.channelName, channel.password? channel.password : "");
    channel.password = "";
  }

  onDMclick(login: string) {
    this.comp.onDMclick(login);
    // this.create = false;
    // this.selectedChannel.messages = undefined;
    // this.chatServ.getDMinfo(login);
  }

}
