import { WorkTimeType } from "./work-time-type.interface";
import { ShiftLocation } from "../../../enums/shift-location.enum";

export interface IWorkTime {
    id: number;
    startDateTime: Date;
    endDateTime: Date | null;
    workTimeType: WorkTimeType;
    location: ShiftLocation;
}
