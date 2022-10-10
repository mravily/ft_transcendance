import { NgModule } from '@angular/core';
import { ProfileFriendsComponent } from './components/profile-friends.component';
import { BlocFriendComponent } from './components/bloc-friend/bloc-friend.component';
import { SharingModule } from 'src/app/pipe/sharing.module';

@NgModule({
	declarations: [ProfileFriendsComponent, BlocFriendComponent],
	exports: [ProfileFriendsComponent, BlocFriendComponent],
	imports: [SharingModule]
})
export class ProfileFriendsModule { }
