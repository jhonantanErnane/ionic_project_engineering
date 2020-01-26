export interface Contact {
    id?: number;
    name:string;
    phone: string;
    photo: string;
    active?: boolean;
    wasSync?: boolean;
}