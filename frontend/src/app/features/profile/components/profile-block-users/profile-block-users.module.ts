import { NgModule } from '@angular/core';
import { ProfileBlockUsersComponent } from './components/profile-block-users.component';
import { BlocBlockUsersComponent } from './components/bloc-block-users/bloc-block-users.component';
import { SharingModule } from 'src/app/pipe/sharing.module';

@NgModule({
  declarations: [ProfileBlockUsersComponent, BlocBlockUsersComponent],
  exports: [ProfileBlockUsersComponent, BlocBlockUsersComponent],
  imports: [SharingModule]
})
export class ProfileBlockUsersModule { }
