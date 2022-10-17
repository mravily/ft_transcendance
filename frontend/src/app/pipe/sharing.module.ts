import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AgoDate } from './ago-date.pipe';
import { OrdinalPipe } from './ordinals.pipe';

@NgModule({
	declarations: [AgoDate, OrdinalPipe],
	exports: [CommonModule, FormsModule, HttpClientModule, RouterModule, AgoDate, OrdinalPipe],
	imports: [CommonModule, FormsModule, HttpClientModule, RouterModule]
})

export class SharingModule {}	
