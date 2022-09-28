import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocAllUserComponent } from './bloc-all-user.component';

describe('BlocAllUserComponent', () => {
  let component: BlocAllUserComponent;
  let fixture: ComponentFixture<BlocAllUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlocAllUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocAllUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
