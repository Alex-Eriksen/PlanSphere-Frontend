import { IWorkScheduleShift } from "../../workScheduleShifts/models/work-schedule-shift.interface";

export interface IWorkSchedule {
    shifts: IWorkScheduleShift[];
}
