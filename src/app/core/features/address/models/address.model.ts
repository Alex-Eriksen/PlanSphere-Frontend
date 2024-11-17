import { IBase } from "../../../abstract/models/base.model";

export interface IAddress extends IBase {
    parent: IAddress;
    streetName?: string;
    houseNumber?: string;
    door?: string;
    floor?: string;
    postalCode?: string;
    countryId?: string;
}
