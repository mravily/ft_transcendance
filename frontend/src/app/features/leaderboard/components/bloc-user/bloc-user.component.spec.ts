import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocUserComponent } from './bloc-user.component';

describe('BlocUserComponent', () => {
  let component: BlocUserComponent;
  let fixture: ComponentFixture<BlocUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlocUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
