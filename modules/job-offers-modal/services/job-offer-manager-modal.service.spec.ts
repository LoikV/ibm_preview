import {TestBed} from '@angular/core/testing';
import {JobOfferManagerModalService} from './job-offer-manager-modal.service';


describe('JobOfferMenagerModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JobOfferManagerModalService = TestBed.get(JobOfferManagerModalService);
    expect(service).toBeTruthy();
  });
});
