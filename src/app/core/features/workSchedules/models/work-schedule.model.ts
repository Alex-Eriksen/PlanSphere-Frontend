import { IBase } from "../../../abstract/models/base.model";
import { IWorkScheduleShift } from "./work-schedule-shift.model";

export interface IWorkSchedule extends IBase {
    parent: IWorkSchedule;
    isDefaultWorkSchedule: boolean;
    workScheduleShifts: IWorkScheduleShift[];
}
