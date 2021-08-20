import { TestBed } from '@angular/core/testing';

import { ChangeOfferPublishStatusService } from './change-offer-publish-status.service';

describe('ChangeOfferPublishStatusService', () => {
  let service: ChangeOfferPublishStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeOfferPublishStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
