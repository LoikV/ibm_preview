import { TestBed } from '@angular/core/testing';

import { SearchCrewProfileService } from './search-crew-profile.service';

describe('PreviewUserProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchCrewProfileService = TestBed.get(SearchCrewProfileService);
    expect(service).toBeTruthy();
  });
});
