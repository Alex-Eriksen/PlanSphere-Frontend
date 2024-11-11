import { DayOfWeek } from "../enums/day-of-week.enum";

export const DayOfWeekTranslationMapper = new Map<DayOfWeek, string>([
    [DayOfWeek.Monday, "WEEK_DAY.MONDAY"],
    [DayOfWeek.Tuesday, "WEEK_DAY.TUESDAY"],
    [DayOfWeek.Wednesday, "WEEK_DAY.WEDNESDAY"],
    [DayOfWeek.Thursday, "WEEK_DAY.THURSDAY"],
    [DayOfWeek.Friday, "WEEK_DAY.FRIDAY"],
    [DayOfWeek.Saturday, "WEEK_DAY.SATURDAY"],
    [DayOfWeek.Sunday, "WEEK_DAY.SUNDAY"],
]);
