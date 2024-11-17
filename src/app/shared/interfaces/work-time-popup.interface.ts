import { IWorkTime } from "../../core/features/workTimes/models/work-time.models";
import { DayOfWeek } from "../../core/enums/day-of-week.enum";

export interface IWorkTimeData {
    workTime?: IWorkTime,
    dayOfWeek: DayOfWeek,
    hour: number,
    firstHalfHour: boolean
}
