import { TestBed } from '@angular/core/testing';

import { NewActionsInformationsService } from './new-actions-informations.service';

describe('NewActionsInformationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewActionsInformationsService = TestBed.get(NewActionsInformationsService);
    expect(service).toBeTruthy();
  });
});
