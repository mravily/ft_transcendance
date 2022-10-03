import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileNavBarComponent } from './profile-nav-bar.component';

describe('ProfileNavBarComponent', () => {
  let component: ProfileNavBarComponent;
  let fixture: ComponentFixture<ProfileNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileNavBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
