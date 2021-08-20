import { TestBed } from '@angular/core/testing';

import { BoatSearchCrewService } from './boat-search-crew.service';

describe('BoatSearchCrewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoatSearchCrewService = TestBed.get(BoatSearchCrewService);
    expect(service).toBeTruthy();
  });
});
