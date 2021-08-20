import { TestBed } from '@angular/core/testing';

import { SearchCrewService } from './search-crew.service';

describe('SearchCrewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchCrewService = TestBed.get(SearchCrewService);
    expect(service).toBeTruthy();
  });
});
