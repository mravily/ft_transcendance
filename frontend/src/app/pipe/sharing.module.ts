import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgoDate } from './ago-date.pipe';
import { OrdinalPipe } from './ordinals.pipe';

@NgModule({
	declarations: [AgoDate, OrdinalPipe],
	exports: [CommonModule, FormsModule, HttpClientModule, AgoDate, OrdinalPipe],
	imports: [CommonModule, FormsModule, HttpClientModule]
})

export class SharingModule {}	
