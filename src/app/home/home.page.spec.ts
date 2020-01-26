import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { ContactTileModule } from '../shared/components/contact-tile/contact-tile.module';
import { RouterModule } from '@angular/router';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoadingModule } from '../shared/components/loading/loading.module';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let sqliteSpy, sqlitePorterSpy;

  let create = Promise.resolve();
  let importSqlToDb = Promise.resolve();
  sqliteSpy = jasmine.createSpyObj('SQLite', { create: create });
  sqlitePorterSpy = jasmine.createSpyObj('SQLitePorter', { importSqlToDb: importSqlToDb });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      imports: [
        IonicModule.forRoot(),
        ContactTileModule,
        LoadingModule,
        RouterModule.forRoot([]),
        HttpClientTestingModule
      ],
      providers: [
        { provide: SQLite, useValue: sqliteSpy },
        { provide: SQLitePorter, useValue: sqlitePorterSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
