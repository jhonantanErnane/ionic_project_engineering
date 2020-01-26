import { TestBed } from '@angular/core/testing';

import { SyncService } from './sync.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';

describe('SyncService', () => {
  let sqliteSpy, sqlitePorterSpy;
  sqliteSpy = jasmine.createSpy('SQLite')
  sqlitePorterSpy = jasmine.createSpy('SQLitePorter')
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      { provide: SQLite, useValue: sqliteSpy },
      { provide: SQLitePorter, useValue: sqlitePorterSpy }
    ]
  }));

  it('should be created', () => {
    const service: SyncService = TestBed.get(SyncService);
    expect(service).toBeTruthy();
  });
});
