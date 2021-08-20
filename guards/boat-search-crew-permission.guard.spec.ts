import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { BoatSearchCrewPermissionGuard } from './boat-search-crew-permission.guard';

describe('BoatSearchCrewPermissionGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoatSearchCrewPermissionGuard]
    });
  });

  it('should ...', inject([BoatSearchCrewPermissionGuard], (guard: BoatSearchCrewPermissionGuard) => {
    expect(guard).toBeTruthy();
  }));
});
