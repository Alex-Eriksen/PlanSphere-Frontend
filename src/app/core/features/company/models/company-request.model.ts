import { IAddress } from "../../address/models/address.model";

export interface ICompanyRequest {
    CompanyName: string;
    CVR: string;
    Address: IAddress;
    CareOf: string;
    ContactName: string;
    ContactEmail: string;
    ContactPhoneNumber: string;
}
