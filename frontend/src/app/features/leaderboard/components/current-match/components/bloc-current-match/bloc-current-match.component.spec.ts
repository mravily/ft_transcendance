import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocCurrentMatchComponent } from './bloc-current-match.component';

describe('BlocCurrentMatchComponent', () => {
  let component: BlocCurrentMatchComponent;
  let fixture: ComponentFixture<BlocCurrentMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlocCurrentMatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocCurrentMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
