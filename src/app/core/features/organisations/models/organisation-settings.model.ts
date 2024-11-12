import { IRole } from "../../roles/models/role.model";
import { IWorkSchedule } from "../../workSchedules/models/work-schedule.model";

export interface IOrganisationSettings {
    defaultRole: IRole;
    defaultWorkSchedule: IWorkSchedule;
}
