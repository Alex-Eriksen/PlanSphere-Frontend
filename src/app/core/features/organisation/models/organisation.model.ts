export interface IOrganisation {
    id: number;
    name: string;
    logoUrl?: string;
    jobTitles? : string[];
    //jobTitles? : JobTitles[];
    organisationMembers: number;
    companyMembers: number;
    departmentMembers: number;
    teamMembers: number;


    // address: {
    //     street: string;
    //     city: string;
    //     postalCode: string;
    //     country: string;
    // };
    // settings: {
    //     defaultRoleId: string;
    //     defaultWorkScheduleId: string;
    // };
}
