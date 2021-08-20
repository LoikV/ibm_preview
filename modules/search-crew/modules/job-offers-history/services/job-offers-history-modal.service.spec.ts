import { TestBed } from '@angular/core/testing';

import { JobOffersHistoryModalService } from './job-offers-history-modal.service';

describe('JobOffersHistoryModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JobOffersHistoryModalService = TestBed.get(JobOffersHistoryModalService);
    expect(service).toBeTruthy();
  });
});
