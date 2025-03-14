import { TestBed } from '@angular/core/testing';

import { FormElementPropertiesService } from './form-element-properties.service';

describe('FormElementPropertiesService', () => {
  let service: FormElementPropertiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormElementPropertiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
