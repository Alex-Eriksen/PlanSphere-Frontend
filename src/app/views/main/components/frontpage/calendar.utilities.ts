import { DayInfo } from "../../../../shared/interfaces/day-info.interface";
import { FormControl, NonNullableFormBuilder } from "@angular/forms";
import { DayOfWeek } from "../../../../shared/enums/day-of-week.enum";
import { DayInfoMonth } from "../../../../shared/enums/day-info-month.enum";
import { CalendarOptions } from "../../../../shared/enums/calendar-options.enum";
import { IWorkSchedule } from "../../../../core/features/workSchedules/models/work-schedule.model";
import { IWorkHour } from "../../../../shared/interfaces/work-hour.interface";
import { ShiftLocation } from "../../../../shared/enums/shift-location.enum";
import { CalendarMonths } from "../../../../shared/enums/calender-months.enum";

export const generateFormGroup = (fb: NonNullableFormBuilder): any => {
    const workSchedule: IWorkSchedule = {
        shifts: [
            {
                id: 1,
                startTime: new Date(2024, 11, 8, 8),
                endTime: new Date(2024, 11, 8, 16),
                day: DayOfWeek.Monday,
                location: ShiftLocation.Office
            },
            {
                id: 2,
                startTime: new Date(2024, 11, 9, 8),
                endTime: new Date(2024, 11, 9, 16),
                day: DayOfWeek.Tuesday,
                location: ShiftLocation.Office
            },
            {
                id: 3,
                startTime: new Date(2024, 11, 10, 8),
                endTime: new Date(2024, 11, 10, 16),
                day: DayOfWeek.Wednesday,
                location: ShiftLocation.Office
            },
            {
                id: 4,
                startTime: new Date(2024, 11,11, 8),
                endTime: new Date(2024, 11, 11, 16),
                day: DayOfWeek.Thursday,
                location: ShiftLocation.Office
            },
            {
                id: 5,
                startTime: new Date(2024, 11, 12, 8),
                endTime: new Date(2024, 11, 12, 16),
                day: DayOfWeek.Friday,
                location: ShiftLocation.Office
            }
        ]
    };
    return fb.group({
        selectedDate: fb.control<Date>(new Date()),
        currentDate: fb.control<Date>(new Date()),
        calendarOption: fb.control<CalendarOptions>(CalendarOptions.Day),
        selectedWeek: fb.control<number | null>(null),
        selectedMonth: fb.control<number>(new Date().getMonth()),
        workHours: fb.control<IWorkHour[]>(generateWorkHours()),
        workSchedule: fb.control<IWorkSchedule>(workSchedule),
        hasIncremented: fb.control<boolean>(false),
        setCurrentDate: fb.control<any>(null),
        daysInMonth: fb.array<FormControl<DayInfo>>([]),
        currentSelectedDay: fb.control<DayInfo | null>(null),
    })
}

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

    // Days in the current month
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

    // Days for the next month to complete the grid
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

function generateWorkHours(): IWorkHour[] {
    const workHours: IWorkHour[] = []
    for (let hour = 0; hour < 24; hour++) {
        workHours.push({
            id: hour,
            isWorkHour: hour > 7 && hour < 17,
        });
    }
    return workHours;
}

