import { TestBed } from '@angular/core/testing';

import { NetworkService } from './network.service';
import { Platform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';

describe('NetworkService', () => {
  let platformSpy, networkSpy, platformReadySpy, onChangeSpy;
  platformReadySpy = Promise.resolve();
  onChangeSpy = Promise.resolve();
  platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });
  networkSpy = jasmine.createSpyObj('Network', {onChange: onChangeSpy})
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: Platform, useValue: platformSpy },
      { provide: Network, useValue: networkSpy },
    ],
  }));

  it('should be created', () => {
    const service: NetworkService = TestBed.get(NetworkService);
    expect(service).toBeTruthy();
  });
});
