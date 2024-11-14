import { IRole } from "../../roles/models/role.model";

export interface ILoggedInUser {
    userId: number;
    organisationId: number;
    firstName: string;
    lastName: string;
    email: string;
    roles: IRole[];
    ownedOrganisations: number[];
    profilePictureUrl: string;
}
