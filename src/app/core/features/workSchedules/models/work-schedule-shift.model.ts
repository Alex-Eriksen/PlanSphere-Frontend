import { IBase } from "../../../abstract/models/base.model";
import { WeekDay } from "@angular/common";
import { ShiftLocation } from "../../../enums/shift-location.enum";

export interface IWorkScheduleShift extends IBase {
    startTime: Date;
    endTime: Date;
    day: WeekDay;
    location: ShiftLocation;
}
