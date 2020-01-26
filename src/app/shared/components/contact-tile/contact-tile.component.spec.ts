import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactTileComponent } from './contact-tile.component';

describe('ContactTileComponent', () => {
  let component: ContactTileComponent;
  let fixture: ComponentFixture<ContactTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactTileComponent],
      imports: [
        IonicModule.forRoot(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactTileComponent);
    component = fixture.componentInstance;
    component.contact = {
      id: 1,
      name: 'Jhonantan',
      phone: '31999999999',
      photo: 'stringfoto',
      active: true,
      wasSync: true
    };
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
