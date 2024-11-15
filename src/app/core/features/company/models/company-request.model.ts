import { IAddress } from "../../address/models/address.model";

export interface ICompanyRequest {
    CompanyName: string;
    CVR: string;
    InheritAddress: boolean;
    Address: IAddress;
    CareOf: string;
    ContactName: string;
    ContactEmail: string;
    ContactPhoneNumber: string;
}
