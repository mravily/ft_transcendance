import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewroomComponent } from './components/newroom/newroom.component';
import { ChatComponent } from './components/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ChatComponent,
    NewroomComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ChatModule { }
