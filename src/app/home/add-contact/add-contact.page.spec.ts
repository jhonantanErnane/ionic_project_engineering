import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BrMaskerModule } from 'br-mask';
import { AddContactPage } from './add-contact.page';
import { ReactiveFormsModule } from '@angular/forms';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { Camera } from '@ionic-native/camera/ngx';

describe('AddContactPage', () => {
  let component: AddContactPage;
  let fixture: ComponentFixture<AddContactPage>;
  let sqliteSpy, sqlitePorterSpy, cameraSpy;

  let create = Promise.resolve();
  let importSqlToDb = Promise.resolve();
  sqliteSpy = jasmine.createSpyObj('SQLite', { create: create });
  sqlitePorterSpy = jasmine.createSpyObj('SQLitePorter', { importSqlToDb: importSqlToDb });
  cameraSpy = jasmine.createSpy('Camera');
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContactPage ],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        BrMaskerModule,
        RouterModule.forRoot([]),
        HttpClientTestingModule
      ],
      providers: [
        { provide: SQLite, useValue: sqliteSpy },
        { provide: SQLitePorter, useValue: sqlitePorterSpy },
        { provide: Camera, useValue: cameraSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddContactPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
