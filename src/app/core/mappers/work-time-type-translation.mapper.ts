import { WorkTimeType } from "../features/workTimes/models/work-time-type.interface";

export const WorkTimeTypeTranslationMapper = new Map<WorkTimeType, string>([
    [WorkTimeType.Regular, "CALENDAR.WORK_TIME_TYPE.REGULAR"],
    [WorkTimeType.Overtime, "CALENDAR.WORK_TIME_TYPE.OVERTIME"],
    [WorkTimeType.Sick, "CALENDAR.WORK_TIME_TYPE.SICK"],
    [WorkTimeType.Vacation, "CALENDAR.WORK_TIME_TYPE.VACATION"],
    [WorkTimeType.Absent, "CALENDAR.WORK_TIME_TYPE.ABSENT"],
]);
