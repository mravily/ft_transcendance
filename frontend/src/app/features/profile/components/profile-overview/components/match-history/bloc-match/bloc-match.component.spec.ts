import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocMatchComponent } from './bloc-match.component';

describe('BlocMatchComponent', () => {
  let component: BlocMatchComponent;
  let fixture: ComponentFixture<BlocMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlocMatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
