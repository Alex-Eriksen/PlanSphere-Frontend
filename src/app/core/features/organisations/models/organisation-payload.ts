import { IAddress } from "../../address/models/address.model";

export interface IOrganisationPayload {
    name: string;
    logoUrl?: string;
    address: IAddress;
}
