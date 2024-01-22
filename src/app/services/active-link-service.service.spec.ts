import { TestBed } from '@angular/core/testing';

import { ActiveLinkServiceService } from './active-link-service.service';

describe('ActiveLinkServiceService', () => {
  let service: ActiveLinkServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveLinkServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
