import { TestBed } from '@angular/core/testing';

import { GlobalAdjustmentsService } from './global-adjustments.service';

describe('GlobalAdjustmentsService', () => {
  let service: GlobalAdjustmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalAdjustmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
