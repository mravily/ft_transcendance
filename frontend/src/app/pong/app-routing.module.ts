import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { LandingPageComponent } from './components/lobby/lobby.component';
import { PongComponent } from './pong/pong.component';

const routes: Routes = [
    { path: 'pong/:gameId', component: PongComponent },
    { path: 'chat', component: ChatComponent },
    { path: '', component: LandingPageComponent }
];

@NgModule({
    imports: [
      RouterModule.forRoot(routes)
    ],
    exports: [
      RouterModule
    ]})
export class AppRoutingModule { }