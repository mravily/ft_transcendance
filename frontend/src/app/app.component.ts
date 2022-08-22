import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { lolI, TestService, user } from './services/test-service/test.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  
  constructor(private service: TestService) {}

  testUsr: user = {id:1, email:'foo@foo.com', name:'foo'};

  testValue$: Observable<lolI> = this.service.getTest();

  testUsr$: Observable<user> = this.service.sendUser(this.testUsr);
  
}
