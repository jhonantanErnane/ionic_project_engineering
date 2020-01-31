import { TestBed } from '@angular/core/testing';

import { SyncService } from './sync.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SQLite } from '@ionic-native/sqlite/ngx';

describe('SyncService', () => {
  let sqliteSpy;
  sqliteSpy = jasmine.createSpy('SQLite')
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      { provide: SQLite, useValue: sqliteSpy }
    ]
  }));

  it('should be created', () => {
    const service: SyncService = TestBed.get(SyncService);
    expect(service).toBeTruthy();
  });
});
