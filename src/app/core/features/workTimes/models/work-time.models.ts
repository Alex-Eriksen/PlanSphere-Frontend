import { WorkTimeType } from "./work-time-type.interface";
import { ShiftLocation } from "../../../enums/shift-location.enum";
import { IBase } from "../../../abstract/models/base.model";

export interface IWorkTime extends IBase {
    startDateTime: Date;
    endDateTime: Date | null;
    workTimeType: WorkTimeType;
    location: ShiftLocation;
}
