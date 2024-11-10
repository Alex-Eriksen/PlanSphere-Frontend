import { IRole } from "../../roles/models/role.model";

export interface ILoggedInUser {
    organisationId: number;
    firstName: string;
    lastName: string;
    email: string;
    roles: IRole[];
    profilePictureUrl: string;
}
