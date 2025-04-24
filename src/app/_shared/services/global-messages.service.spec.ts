import { TestBed } from '@angular/core/testing';

import { GlobalMessagesService } from './global-messages.service';

describe('GlobalMessagesService', () => {
  let service: GlobalMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
