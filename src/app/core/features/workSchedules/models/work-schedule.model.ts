import { WorkScheduleShiftDTO } from "../../users/models/user.model";
import { IBase } from "../../../abstract/models/base.model";

export interface WorkScheduleDTO extends IBase {
    parent: WorkScheduleDTO;
    isDefaultWorkSchedule: boolean;
    workScheduleShifts: WorkScheduleShiftDTO[];
}
