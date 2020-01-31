export interface Contact {
    id?: number;
    idServer?: string;
    name:string;
    phone: string;
    photo: string;
    active?: boolean | number;
    wasSync?: boolean;
}