import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, Subscription } from 'rxjs';
import { channelI } from '../../models/channel.model';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-newroom',
  templateUrl: './newroom.component.html',
  styleUrls: ['./newroom.component.scss']
})
export class NewroomComponent implements OnInit {

  roomForm!: FormGroup;
  searchForm!: FormGroup;
  searchSubcription!: Subscription;
  publicChannels$: Observable<string[]>;
  password: string = "";

  constructor(private builder: FormBuilder, private chatService: ChatService) {
    this.publicChannels$ = chatService.getPublicChannelsObs();
  }

  ngOnInit(): void {
    this.roomForm = this.builder.group({
      name: [null, [Validators.required]],
      description: [null, []],
      members: this.builder.array([new FormControl()]),
      ispublic: [null, []],
      password: [null]
    },
    {
      updateOn: 'blur'
    })
    this.searchForm = this.builder.group({
      search: [null],
      password: [null]
    });
    this.searchSubcription = this.searchForm.valueChanges.pipe(
      map((form) => form.search)
    ).subscribe((search) => {
      this.chatService.searchPublicChannels(search);
    });
    this.chatService.getPublicChannels({page: 1, limit: 10});
  }
  ngOnDestroy() {
    this.searchSubcription.unsubscribe();
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
    console.log(this.roomForm.value);
    let chan: channelI = {
      channelName: this.roomForm.value.name,
      // description: this.roomForm.value.description,
      userList: this.roomForm.value.members,
      isPrivate: !this.roomForm.value.ispublic,
      isDirect: false,
      is_pwd: this.roomForm.value.password != null,
      pwd: this.roomForm.value.password,
      creator: "me", // only to compile, not necessary
    }
    this.chatService.createChannel(chan);
  }
  onJoin(channelName: string) {
    console.log(channelName, this.password);
    this.chatService.joinChannel(channelName, this.password);
  }

}
