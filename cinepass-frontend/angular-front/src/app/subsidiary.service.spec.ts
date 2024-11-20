import { TestBed } from '@angular/core/testing';

import { SubsidiaryService } from './subsidiary.service';

describe('SubsidiaryService', () => {
  let service: SubsidiaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubsidiaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
