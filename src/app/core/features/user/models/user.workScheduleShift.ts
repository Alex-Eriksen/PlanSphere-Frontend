import { Time, WeekDay } from "@angular/common";
import { ShiftLocation } from "./user.shiftLocation.enum";

export interface IWorkScheduleShift {
    startTime: Time;
    endTime: Time;
    day: WeekDay;
    location: ShiftLocation;
}
