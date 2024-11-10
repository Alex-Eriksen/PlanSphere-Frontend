import { DayOfWeek } from "../../../../shared/enums/day-of-week.enum";
import { ShiftLocation } from "../../../../shared/enums/shift-location.enum";

export interface IWorkScheduleShift {
    id: number;
    startTime: Date;
    endTime: Date;
    day: DayOfWeek,
    location: ShiftLocation
}
