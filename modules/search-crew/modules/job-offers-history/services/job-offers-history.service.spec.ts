import { TestBed } from '@angular/core/testing';

import { JobOffersHistoryService } from './job-offers-history.service';

describe('JobOffersHistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JobOffersHistoryService = TestBed.get(JobOffersHistoryService);
    expect(service).toBeTruthy();
  });
});
