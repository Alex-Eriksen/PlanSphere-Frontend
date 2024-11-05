import { Time } from "@angular/common";

export interface ICompany {
    companyName: string;
    cvr: string;
    contactName: string;
    contactEmail: string;
    contactPhoneNumber: string;
    address: string;
    createdAt: Time;
    createdBy: string;
}
