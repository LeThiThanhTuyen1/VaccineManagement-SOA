import { TestBed } from '@angular/core/testing';

import { VaccinationHistoryService } from './vaccination-history.service';

describe('VaccinationHistoryService', () => {
  let service: VaccinationHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VaccinationHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
