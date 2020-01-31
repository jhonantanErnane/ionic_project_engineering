import { TestBed } from '@angular/core/testing';

import { DatabaseService } from './database.service';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatabaseService', () => {
  let sqliteSpy;
  let create = Promise.resolve();
  sqliteSpy = jasmine.createSpyObj('SQLite', { create: create })
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      { provide: SQLite, useValue: sqliteSpy }
    ]
  }));

  it('should be created', () => {
    const service: DatabaseService = TestBed.get<DatabaseService>(DatabaseService);
    expect(service).toBeTruthy();
  });

  it('Criação de usuário com sucesso', async () => {
    const service: DatabaseService = TestBed.get(DatabaseService);
    const resp = await service.addContact({name: 'jhonantan', phone:'(31) 99999-9999', photo: 'stringFoto'});
    expect(resp.successful).toBeTruthy();
  });
});
