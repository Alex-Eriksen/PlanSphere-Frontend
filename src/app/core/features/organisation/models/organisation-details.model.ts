import { IAddress } from "../../address/models/address.model";

export interface IOrganisationDetails
{
    id: number;
    name: string;
    logoUrl?: string;
    address: IAddress;
    settings: null;
    createdAt: Date;
}
