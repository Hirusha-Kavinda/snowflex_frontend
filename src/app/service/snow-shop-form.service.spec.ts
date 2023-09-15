import { TestBed } from '@angular/core/testing';

import { SnowShopFormService } from './snow-shop-form.service';

describe('SnowShopFormService', () => {
  let service: SnowShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnowShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
