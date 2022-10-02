import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocFriendPublicComponent } from './bloc-friend-public.component';

describe('BlocFriendPublicComponent', () => {
  let component: BlocFriendPublicComponent;
  let fixture: ComponentFixture<BlocFriendPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlocFriendPublicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocFriendPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
