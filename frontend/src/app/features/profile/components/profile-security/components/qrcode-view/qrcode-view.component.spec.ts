import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeViewComponent } from './qrcode-view.component';

describe('QrcodeViewComponent', () => {
  let component: QrcodeViewComponent;
  let fixture: ComponentFixture<QrcodeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrcodeViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrcodeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
