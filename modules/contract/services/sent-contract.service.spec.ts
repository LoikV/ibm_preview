import { TestBed } from '@angular/core/testing';

import { SentContractService } from './sent-contract.service';

describe('SentContractService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SentContractService = TestBed.get(SentContractService);
    expect(service).toBeTruthy();
  });
});
