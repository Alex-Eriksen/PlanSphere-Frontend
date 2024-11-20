import { WorkTimeType } from "./work-time-type.interface";
 import { ShiftLocation } from "../../../enums/shift-location.enum";

export interface IWorkTimeRequest {
    startDateTime: string;
    endDateTime: string | null;
    workTimeType: WorkTimeType;
    location: ShiftLocation;
    loggedBy?: number | null;
}
