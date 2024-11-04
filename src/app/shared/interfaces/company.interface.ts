import { Time } from "@angular/common";

export interface ICompany {
    CompanyName: string;
    CVR: string;
    ContactName: string;
    ContactEmail: string;
    ContactPhoneNumber: string;
    Address: string;
    CreatedAt: Time;
    CreatedBy: string;
}
