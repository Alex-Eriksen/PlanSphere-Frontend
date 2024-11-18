import { DayOfWeek } from "../../core/enums/day-of-week.enum";

export interface IWorkHour {
    id: number;
    isWorkHour: boolean;
    day: DayOfWeek
}
