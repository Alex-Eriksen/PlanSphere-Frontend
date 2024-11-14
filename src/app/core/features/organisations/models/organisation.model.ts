import { IAddress } from "../../address/models/address.model";
import { IBase } from "../../../abstract/models/base.model";
import { IOrganisationSettings } from "./organisation-settings.model";

export interface IOrganisation extends IBase
{
    name: string;
    logoUrl?: string;
    address: IAddress;
    settings: IOrganisationSettings;
    createdAt: Date;
}
