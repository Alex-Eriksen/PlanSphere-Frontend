import { IBase } from "../../../abstract/models/base.model";
import { IAddress } from "../../address/models/address.model";
import { ICompanySettings } from "./company-settings.model";

export interface ICompany extends IBase {
    name: string;
    cvr: string;
    contactName?: string;
    contactEmail?: string;
    contactPhoneNumber?: string;
    address: IAddress;
    settings: ICompanySettings;
    careOf?: string;
    createdAt: Date;
    createdBy: string;
}
