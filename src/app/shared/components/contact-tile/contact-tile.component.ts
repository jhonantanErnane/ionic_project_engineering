import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../../models/contact';

@Component({
  selector: 'app-contact-tile',
  templateUrl: './contact-tile.component.html',
  styleUrls: ['./contact-tile.component.scss'],
})
export class ContactTileComponent implements OnInit {

  @Input() contact: Contact;
  @Output() removeContactEvent = new EventEmitter<number>();

  constructor() { }

  ngOnInit() { }

  removeContact() {
    this.removeContactEvent.next(this.contact.id);
  }
}
