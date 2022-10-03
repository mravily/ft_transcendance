import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocFriendComponent } from './bloc-friend.component';

describe('BlocFriendComponent', () => {
  let component: BlocFriendComponent;
  let fixture: ComponentFixture<BlocFriendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlocFriendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
