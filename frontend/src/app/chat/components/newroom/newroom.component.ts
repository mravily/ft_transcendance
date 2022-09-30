import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Subscription } from 'rxjs';

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

  constructor(private builder: FormBuilder) {
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
      password: [{value: null, disabled: true}]
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
      // this.searchResult = api.getSearch();
    });
  }
  ngOnDestroy() {
    this.searchSubcription.unsubscribe();
  }

  onSubmitForm()  {}
  onJoin(channelName: string) {
    console.log(channelName, this.password);
  }

}
