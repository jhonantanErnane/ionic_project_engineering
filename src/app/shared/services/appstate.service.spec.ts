import { TestBed } from '@angular/core/testing';

import { AppStateService } from './appstate.service';

describe('AppstateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppStateService = TestBed.get(AppStateService);
    expect(service).toBeTruthy();
  });

});
