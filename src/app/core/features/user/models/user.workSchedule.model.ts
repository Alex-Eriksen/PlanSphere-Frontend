import { IWorkScheduleShift } from "./user.workScheduleShift";

export interface IWorkSchedule {
    parent?: IWorkSchedule;
    isDefaultWorkSchedule: boolean;
    workScheduleShifts: IWorkScheduleShift[];
}
