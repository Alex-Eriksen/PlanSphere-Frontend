import { IAddress } from "../../address/models/address.model";

export interface ICompanyRequest {
    companyName: string;
    cvr: string;
    inheritAddress: boolean;
    address: IAddress;
    careOf: string;
    contactName: string;
    contactEmail: string;
    contactPhoneNumber: string;
}
