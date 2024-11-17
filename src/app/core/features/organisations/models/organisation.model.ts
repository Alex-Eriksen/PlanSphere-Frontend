import { IBase } from "../../../abstract/models/base.model";

export interface IOrganisation extends IBase
{
    name: string;
    logoUrl?: string;
    organisationMembers: number;
    companyMembers: number;
    departmentMembers: number;
    teamMembers: number;
}
