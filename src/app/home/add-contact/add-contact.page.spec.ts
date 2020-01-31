import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BrMaskerModule } from 'br-mask';
import { AddContactPage } from './add-contact.page';
import { ReactiveFormsModule } from '@angular/forms';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { Camera } from '@ionic-native/camera/ngx';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { DatabaseServiceMock } from 'src/app/mock/database.service.mock';
import { Contact } from 'src/app/shared/models/contact';

describe('AddContactPage', () => {
  let component: AddContactPage;
  let fixture: ComponentFixture<AddContactPage>;
  let sqliteSpy, cameraSpy;

  let create = Promise.resolve();
  sqliteSpy = jasmine.createSpyObj('SQLite', { create: create });
  cameraSpy = jasmine.createSpy('Camera');
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddContactPage],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        BrMaskerModule,
        RouterModule.forRoot([]),
        HttpClientTestingModule
      ],
      providers: [
        { provide: SQLite, useValue: sqliteSpy },
        { provide: Camera, useValue: cameraSpy },
        { provide: DatabaseService, useClass: DatabaseServiceMock },
      ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AddContactPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`fomulário inválido`, async(() => {
    component.form.controls['name'].setValue('');
    component.form.controls['imgUrl'].setValue('');
    component.form.controls['phone'].setValue('');
    expect(component.form.valid).toBeFalsy();
  }));

  it(`fomulário válido`, async(() => {
    component.form.controls['name'].setValue('nome teste');
    component.form.controls['imgUrl'].setValue('imagemUrl');
    component.form.controls['phone'].setValue('(31) 99999-9999');
    expect(component.form.valid).toBeTruthy();
  }));

  it(`Salvar usuário`, async(async () => {
    const s = new DatabaseServiceMock();
    component.form.controls['name'].setValue('nome teste');
    component.form.controls['imgUrl'].setValue('imagemUrl');
    component.form.controls['phone'].setValue('(31) 99999-9999');
    const contact: Contact = {
      name: component.form.get('name').value,
      photo: component.form.get('imgUrl').value,
      phone: component.form.get('phone').value,
    };
    const resp = await s.addContact(contact);
    expect(resp.successful).toBeTruthy();
  }));
});
