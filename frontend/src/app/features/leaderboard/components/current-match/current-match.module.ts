import { NgModule } from '@angular/core';
import { CurrentMatchComponent } from './components/current-match.component';
import { BlocCurrentMatchComponent } from './components/bloc-current-match/bloc-current-match.component';
import { SharingModule } from 'src/app/pipe/sharing.module';

@NgModule({
  declarations: [CurrentMatchComponent, BlocCurrentMatchComponent],
  exports: [CurrentMatchComponent, BlocCurrentMatchComponent],
  imports: [SharingModule]
})
export class CurrentMatchModule { }
