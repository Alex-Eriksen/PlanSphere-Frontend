import { DayInfoMonth } from "../enums/day-info-month.enum";

export interface DayInfo {
    date: number;
    name: string;
    weekNumber: number;
    isMonth: DayInfoMonth;
    month: number;
}
