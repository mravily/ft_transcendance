import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ContactListComponent } from './components/sidebar-menu/components/contact-list/contact-list.component';
import { SidebarMenuComponent } from './components/sidebar-menu/components/sidebar-menu/sidebar-menu.component';
import { ProfileButtonComponent } from './components/sidebar-menu/components/profile-button/profile-button.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  declarations: [
	HeaderComponent,
	FooterComponent,
  	ContactListComponent,
	SidebarMenuComponent,
	ProfileButtonComponent,
 	NotFoundComponent
  ],
  imports: [
    CommonModule,
	RouterModule,
  ],
  exports: [
	HeaderComponent,
	FooterComponent,
	SidebarMenuComponent,
	NotFoundComponent
  ],
})
export class CoreModule { }
