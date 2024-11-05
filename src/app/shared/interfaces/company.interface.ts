import { Time } from "@angular/common";

export interface ICompany {
    id: number;
    name: string;
    logoUrl: string;
    cvr: string;
    contactName: string;
    contactEmail: string;
    contactPhoneNumber: string;
    careOf: string;
    createdAt: Time;
    createdBy: string;
}
