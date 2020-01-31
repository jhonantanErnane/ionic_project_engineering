import { Contact } from './contact';

export interface ResponseModel {
    deleteLocalData: boolean;
    contacts: Array<Contact>;
}