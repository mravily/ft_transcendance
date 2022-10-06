import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Subscription } from 'rxjs';
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
  publicChannels: any[];
  password: string = "";

  constructor(private builder: FormBuilder, private chatService: ChatService) {
    this.publicChannels = [
      { name: "general", nbUsers : 21},
      { name: "random", nbUsers : 12},
      { name: "memes", nbUsers : 1},
    ];
  }

  ngOnInit(): void {
    this.roomForm = this.builder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      members: [null, [Validators.required]],
      ispublic: [null, [Validators.required]],
      password: [{value: null}]
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
    this.chatService.getPublicChannelsObs().subscribe((channels: any[]) => {
      this.publicChannels = channels;
    });
  }
  ngOnDestroy() {
    this.searchSubcription.unsubscribe();
  }

  onSubmitForm()  {
    console.log(this.roomForm.value);
    this.chatService.createChannel(this.roomForm.value);
  }
  onJoin(channelName: string) {
    console.log(channelName, this.password);
    this.chatService.joinChannel(channelName, this.password);
  }

}
