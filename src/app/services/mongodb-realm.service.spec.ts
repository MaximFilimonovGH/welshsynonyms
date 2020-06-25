import { TestBed } from '@angular/core/testing';

import { MongodbRealmService } from './mongodb-realm.service';

describe('MongodbRealmService', () => {
  let service: MongodbRealmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MongodbRealmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
