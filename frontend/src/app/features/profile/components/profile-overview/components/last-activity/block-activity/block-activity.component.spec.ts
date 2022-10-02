import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockActivityComponent } from './block-activity.component';

describe('BlockActivityComponent', () => {
  let component: BlockActivityComponent;
  let fixture: ComponentFixture<BlockActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockActivityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
