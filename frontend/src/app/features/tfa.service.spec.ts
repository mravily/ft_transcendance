import { TestBed } from '@angular/core/testing';

import { TfaService } from './tfa.service';

describe('TfaService', () => {
  let service: TfaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TfaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
