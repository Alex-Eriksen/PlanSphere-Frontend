import { DayInfo } from "../../../../shared/interfaces/day-info.interface";
import { DayInfoMonth } from "../../../../shared/enums/day-info-month.enum";
import { IWorkSchedule } from "../../../../core/features/workSchedules/models/work-schedule.model";
import { IWorkHour } from "../../../../shared/interfaces/work-hour.interface";
import { CalendarMonths } from "../../../../shared/enums/calender-months.enum";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { ShiftLocation } from "../../../../core/enums/shift-location.enum";
import { IWorkTime } from "../../../../core/features/workTimes/models/work-time.models";
import { WorkTimeType } from "../../../../core/features/workTimes/models/work-time-type.interface";
import { formatDateWithoutTimezone } from "../../../../shared/utilities/date.utilities";
import { DayOfWeek } from "../../../../core/enums/day-of-week.enum";
import { QuarterHour } from "../../../../shared/enums/quarter-hour.enum";

export const generateDaysForMonth = (month: number, year: number): DayInfo[] => {
    const daysInMonth: DayInfo[] = [];
    const firstDayOfWeek = Object.keys(DayOfWeek).indexOf(getDayOfWeek(new Date(year, month, 1)));
    let weekNumber = 1;

    const previousMonth = month === 0 ? 11 : month - 1;
    const previousMonthYear = month === 0 ? year - 1 : year;
    const daysInPreviousMonth = new Date(previousMonthYear, previousMonth + 1, 0).getDate();

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        daysInMonth.push({
            date: daysInPreviousMonth - i,
            name: new Date(previousMonthYear, previousMonth, daysInPreviousMonth - i).toLocaleString('en-US', { weekday: 'long' }),
            isMonth: DayInfoMonth.Previous,
            weekNumber,
            month: previousMonth,
        });
    }

    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInCurrentMonth; day++) {
        const dayInfo: DayInfo = {
            date: day,
            name: new Date(year, month, day).toLocaleString('en-US', { weekday: 'long' }),
            isMonth: DayInfoMonth.Current,
            weekNumber,
            month: month
        }
        daysInMonth.push(dayInfo);

        if (dayInfo.name === 'Sunday') {
            weekNumber++;
        }
    }

    const lastDayOfWeek = (firstDayOfWeek + daysInCurrentMonth - 1) % 7;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;

    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
        daysInMonth.push({
            date: i,
            name: new Date(nextMonthYear, nextMonth, i).toLocaleString('en-US', { weekday: 'long' }),
            isMonth: DayInfoMonth.Next,
            weekNumber,
            month: nextMonth
        });
    }

    return daysInMonth;
};


export const incrementMonth = (month: number, year: number): { month: number, year: number } => {
    month = month === 11 ? 0 : month + 1;
    year = month === 0 ? year + 1 : year;
    return { month, year };
};

export const decrementMonth = (month: number, year: number): { month: number, year: number } => {
    month = month === 0 ? 11 : month - 1;
    year = month === 11 ? year - 1 : year;
    return { month, year };
};

export function getDayOfWeek(date: Date): DayOfWeek {
    const jsDayOfWeek = date.getDay();
    return Object.values(DayOfWeek)[(jsDayOfWeek === 0 ? 6 : jsDayOfWeek - 1)];
}

export function getMonthDisplayName(month: number) {
    return Object.keys(CalendarMonths)[month];
}

export function getDayOfWeekFromDaysInMonth(daysInMonth: DayInfo[], dayName: string, weekNumber: number): DayInfo {
    return daysInMonth.find(x => x.weekNumber === weekNumber && x.name === dayName)!;
}

export function generateWorkHours(workSchedule: IWorkSchedule): IWorkHour[] {
    const workHours: IWorkHour[] = []

    for(const shift of workSchedule.workScheduleShifts) {
        const startDate = timeOnlyToDate(shift.startTime);
        const endDate = timeOnlyToDate(shift.endTime);
        const startHour = startDate.getHours();
        const endHour = endDate.getHours();
        for (let hour = 0; hour < 24; hour++) {
            workHours.push({
                id: hour,
                isWorkHour: isHourInShift(hour, startHour, endHour),
                day: shift.day,
            });
        }
    }
    return workHours;
}

export function timeOnlyToDate(timeOnly: string): Date {
    const [hours, minutes, seconds] = timeOnly.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
}

export function isHourInShift(hour: number, startHour: number, endHour: number): boolean {
    if (startHour <= endHour) {
        return hour >= startHour && hour < endHour;
    } else {
        return hour >= startHour || hour < endHour;
    }
}

export const generateHours = (): number[] => {
    return Array.from({ length: 24 }, (_, i) => i);
}

export const generateQuarterHours = (): number[] => {
    return Object.values(QuarterHour).filter((value): value is number => typeof value === 'number');
};

export const constructWorkTimeFormGroup = (fb: NonNullableFormBuilder, workTime: IWorkTime | undefined, selectedDate: Date): FormGroup => {
    let startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    let endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

    if(workTime) {
        startDate.setHours(workTime.startDateTime.getHours(), (Math.round(workTime.startDateTime.getMinutes()/15) * 15) % 60, 0, 0);

        if(workTime.endDateTime !== null) {
            endDate.setHours(workTime.endDateTime!.getHours(), (Math.round(workTime.endDateTime!.getMinutes()/15) * 15) % 60, 0, 0);
        } else {
            endDate = setToClosetsQuarter(endDate);
        }
    } else {
        startDate = selectedDate;
    }

    return fb.group({
        startDateTime: fb.control<string>(formatDateWithoutTimezone(startDate), Validators.required),
        endDateTime: fb.control<string>(formatDateWithoutTimezone(endDate), Validators.required),
        workTimeType: fb.control<WorkTimeType | null>(workTime?.workTimeType ?? null, Validators.required),
        location: fb.control<ShiftLocation | null>(workTime?.location ?? null, Validators.required)
    })
};


export function setToClosetsQuarter(date: Date): Date {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.round(minutes / 15) * 15;

    const adjustedDate = new Date(date);

    if (roundedMinutes === 60) {
        adjustedDate.setHours(adjustedDate.getHours() + 1);
        adjustedDate.setMinutes(0, 0, 0);
    } else {
        adjustedDate.setMinutes(roundedMinutes, 0, 0);
    }

    return adjustedDate;
}
