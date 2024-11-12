import { IAddress } from "../../address/models/address.model";

export interface IOrganisationDetails
{
    id: number;
    name: string;
    logoUrl?: string;
    address: IAddress;
    settings: {
        defaultRoleId: number;
        defaultWorkScheduleId : number;
    };
    createdAt: Date;
}
