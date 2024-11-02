import { IAddress } from "../../address/models/address.model";

export interface ICompany {
    name: string;
    cVR: string;
    contactName?: string;
    contactEmail?: string;
    contactPhoneNumber?: string;
    address: IAddress;
    careOf?: string;
    createdAt: Date;
    createdBy: string;
}
