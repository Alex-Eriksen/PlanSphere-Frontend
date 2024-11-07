import { IBase } from "../../../abstract/models/base.model";
import { ShiftLocation } from "../../../enums/shift-location.enum";
import { DayOfWeek } from "../../../enums/day-of-week.enum";

export interface IWorkScheduleShift extends IBase {
    startTime: string;
    endTime: string;
    day: DayOfWeek;
    location: ShiftLocation;
}
