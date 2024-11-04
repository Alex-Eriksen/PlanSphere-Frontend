import { IAddress } from "../../address/modals/address.model";

export interface IOrganisationDetails
{
    id: number;
    name: string;
    logoUrl?: string;
    address: IAddress;
    settings: null;
    createdAt: Date;
}
