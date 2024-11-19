import { Period } from "../features/workTimes/models/period.enum";

export const PeriodTranslationMapper = new Map<Period, string>([
    [Period.Day, "PERIODS.DAY"],
    [Period.Week, "PERIODS.WEEK"],
    [Period.Month, "PERIODS.MONTH"],
    [Period.Year, "PERIODS.YEAR"],
    [Period.Total, "PERIODS.TOTAL"],
]);
