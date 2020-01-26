import { TestBed } from '@angular/core/testing';

import { DatabaseService } from './database.service';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';

describe('DatabaseService', () => {
  let sqliteSpy, sqlitePorterSpy;
  let create = Promise.resolve();
  let importSqlToDb = Promise.resolve();
  sqliteSpy = jasmine.createSpyObj('SQLite', { create: create })
  sqlitePorterSpy = jasmine.createSpyObj('SQLitePorter', { importSqlToDb: importSqlToDb })
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      { provide: SQLite, useValue: sqliteSpy },
      { provide: SQLitePorter, useValue: sqlitePorterSpy }
    ]
  }));

  it('should be created', () => {
    const service: DatabaseService = TestBed.get(DatabaseService);
    expect(service).toBeTruthy();
  });

});
