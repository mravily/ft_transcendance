import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-newroom',
  templateUrl: './newroom.component.html',
  styleUrls: ['./newroom.component.scss']
})
export class NewroomComponent implements OnInit {

  roomForm!: FormGroup;
  
  constructor(private builder: FormBuilder) { }

  ngOnInit(): void {
    this.roomForm = this.builder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      members: [null, [Validators.required]],
      ispublic: [null, [Validators.required]],
      password: [null]
    },
    {
      updateOn: 'blur'
    })
  }

  onSubmitForm()  {}

}
