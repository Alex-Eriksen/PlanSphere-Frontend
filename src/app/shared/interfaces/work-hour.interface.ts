import { DayOfWeek } from "../enums/day-of-week.enum";

export interface IWorkHour {
    id: number;
    isWorkHour: boolean;
    day: DayOfWeek
}
