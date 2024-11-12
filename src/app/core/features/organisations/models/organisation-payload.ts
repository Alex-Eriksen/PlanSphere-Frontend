import { IAddress } from "../../address/models/address.model";
import { IOrganisationSettings } from "./organisation-settings";

export interface IOrganisationPayload {
    name: string;
    address: IAddress;
    settings: IOrganisationSettings;
}
