import { TestBed } from '@angular/core/testing';

import { Mys1Service } from './mys1.service';

describe('Mys1Service', () => {
  let service: Mys1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mys1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
