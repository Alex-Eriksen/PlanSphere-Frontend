export interface IOrganisation {
    id: number;
    name: string;
    logoUrl?: string;
    jobTitles? : string[];
    organisationMembers: number;
    companyMembers: number;
    departmentMembers: number;
    teamMembers: number;
}
