import { TestBed } from '@angular/core/testing';

import { JobOfferManagerService } from './job-offer-manager.service';

describe('JobOfferManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JobOfferManagerService = TestBed.get(JobOfferManagerService);
    expect(service).toBeTruthy();
  });
});
