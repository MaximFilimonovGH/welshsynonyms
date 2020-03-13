import { TestBed } from '@angular/core/testing';

import { MongodbStitchService } from './mongodb-stitch.service';

describe('MongodbStitchService', () => {
  let service: MongodbStitchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MongodbStitchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
