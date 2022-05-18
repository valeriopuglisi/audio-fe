import { TestBed } from '@angular/core/testing';

import { DeepLearningFeaturesService } from './deep-learning-features.service';

describe('DeepLearningFeaturesService', () => {
  let service: DeepLearningFeaturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeepLearningFeaturesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
