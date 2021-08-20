import { TestBed } from '@angular/core/testing';

import { JobOffersDetailsService } from './job-offers-details.service';

describe('JobOffersDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JobOffersDetailsService = TestBed.get(JobOffersDetailsService);
    expect(service).toBeTruthy();
  });
});
