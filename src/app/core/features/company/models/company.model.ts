import { IAddress } from "../../address/models/address.model";

export interface ICompany {
    name: string;
    cvr: string;
    contactName?: string;
    contactEmail?: string;
    contactPhoneNumber?: string;
    address: IAddress;
    careOf?: string;
    createdAt: Date;
    createdBy: string;
}
