import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocBlockUsersComponent } from './bloc-block-users.component';

describe('BlocBlockUsersComponent', () => {
  let component: BlocBlockUsersComponent;
  let fixture: ComponentFixture<BlocBlockUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlocBlockUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocBlockUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
