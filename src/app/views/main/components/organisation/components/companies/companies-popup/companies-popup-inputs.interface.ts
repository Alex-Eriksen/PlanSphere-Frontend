import { IAddress } from "../../../../../../../core/features/address/models/address.model";

export interface ICompaniesPopupInputs {
    companyId: number;
    name: string;
    cvr: string;
    address: IAddress;
    contactName: string;
    contactEmail: string;
    contactPhoneNumber: string;

}
