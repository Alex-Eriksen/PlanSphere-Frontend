import { IAddress } from "../../address/models/address.model";
import { IOrganisationSettings } from "./organisation-settings.model";

export interface IOrganisationDetails
{
    id: number;
    name: string;
    logoUrl?: string;
    address: IAddress;
    settings: IOrganisationSettings
    createdAt: Date;
}
