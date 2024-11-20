import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { subsidiaryGuard } from './subsidiary.guard';

describe('subsidiaryGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => subsidiaryGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
