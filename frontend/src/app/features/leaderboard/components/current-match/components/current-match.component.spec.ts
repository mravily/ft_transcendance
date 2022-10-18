import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentMatchComponent } from './current-match.component';

describe('CurrentMatchComponent', () => {
  let component: CurrentMatchComponent;
  let fixture: ComponentFixture<CurrentMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentMatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
