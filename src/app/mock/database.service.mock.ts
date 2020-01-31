import { Injectable } from '@angular/core';
import { Contact } from '../shared/models/contact';
import { GenericResponse } from '../shared/models/generic.response';

@Injectable()
export class DatabaseServiceMock {
    constructor() { }

    addContact(contact: Contact, setDataChange = true): Promise<GenericResponse> {
        return new Promise((resolve, reject) => {

            if (contact && contact.name && contact.phone && contact.photo) {
                resolve({ successful: true });
            } else {
                resolve({ successful: false });
            }
        });
    }

}