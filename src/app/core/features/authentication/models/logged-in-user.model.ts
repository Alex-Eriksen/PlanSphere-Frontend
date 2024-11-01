import { IRole } from "../../roles/models/role.model";

export interface ILoggedInUser {
    roles: IRole[];
}
