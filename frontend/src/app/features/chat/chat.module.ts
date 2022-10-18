import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewroomComponent } from './components/newroom/newroom.component';
import { ChatComponent } from './components/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PongService } from '../pong/services/pong.service';



@NgModule({
	declarations: [
		ChatComponent,
		NewroomComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
	],
	providers: [PongService],
})
export class ChatModule { }
