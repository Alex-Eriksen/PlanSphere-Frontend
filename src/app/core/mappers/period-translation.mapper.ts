import { Period } from "../features/workTimes/models/period.enum";

export const PeriodTranslationMapper = new Map<Period, string>([
    [Period.Day, "CALENDAR.PERIODS.DAY"],
    [Period.Week, "CALENDAR.PERIODS.WEEK"],
    [Period.Month, "CALENDAR.PERIODS.MONTH"],
    [Period.Year, "CALENDAR.PERIODS.YEAR"],
    [Period.Total, "CALENDAR.PERIODS.TOTAL"],
]);
