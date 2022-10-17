import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBlockUsersComponent } from './profile-block-users.component';

describe('ProfileBlockUsersComponent', () => {
  let component: ProfileBlockUsersComponent;
  let fixture: ComponentFixture<ProfileBlockUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileBlockUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileBlockUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
