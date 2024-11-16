import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CalendarDateService } from "./calendar-date.service";
import {
    decrementMonth,
    generateDaysForMonth,
    incrementMonth
} from "../../views/main/components/frontpage/calendar.utilities";
import { DayOfWeek } from "../enums/day-of-week.enum";
import { DayInfo } from "../../shared/interfaces/day-info.interface";
import { CalendarOptions } from "../../shared/enums/calendar-options.enum";
import { DayInfoMonth } from "../../shared/enums/day-info-month.enum";

@Injectable({
    providedIn: 'root'
})
export class CalendarFacadeService {
    readonly #calendarDateService = inject(CalendarDateService)

    private selectedDateSubject = new BehaviorSubject<Date>(new Date());
    private currentDateSubject = new BehaviorSubject<Date>(new Date());
    private currentSelectedDaySubject = new BehaviorSubject<DayInfo | null>(null);
    private calendarOptionSubject = new BehaviorSubject<CalendarOptions>(CalendarOptions.Day);
    private selectedWeekSubject = new BehaviorSubject<number | null>(null);
    private selectedMonthSubject = new BehaviorSubject<number>(new Date().getMonth());
    private daysInMonthSubject = new BehaviorSubject<DayInfo[]>([]);

    selectedDate$ = this.selectedDateSubject.asObservable();
    currentDate$ = this.currentDateSubject.asObservable();
    currentSelectedDay$ = this.currentSelectedDaySubject.asObservable();
    calendarOption$ = this.calendarOptionSubject.asObservable();
    selectedWeek$ = this.selectedWeekSubject.asObservable();
    selectedMonth$ = this.selectedMonthSubject.asObservable();
    daysInMonth$ = this.daysInMonthSubject.asObservable();

    initializeCalendar(
        selectedDate: Date,
        currentDate: Date,
        calendarOption: CalendarOptions,
        selectedWeek: number | null,
        selectedMonth: number,
        daysInMonth: DayInfo[]
    ): void {
        this.selectedDateSubject.next(selectedDate);
        this.currentDateSubject.next(currentDate);
        this.calendarOptionSubject.next(calendarOption);
        this.selectedWeekSubject.next(selectedWeek);
        this.selectedMonthSubject.next(selectedMonth);
        this.daysInMonthSubject.next(daysInMonth);

        this.#generateDaysForSelectedMonth();
        const selectedDay = this.daysInMonthSubject.getValue().find(day => day.month === currentDate.getMonth() && day.date === currentDate.getDate())!;
        this.currentSelectedDaySubject.next(selectedDay);
        this.#initializeCalendarService();
    }

    refreshTable(): void {
        this.selectedMonthSubject.next(this.selectedMonthSubject.getValue());
    }

    selectDate(selectedDay: DayInfo): void {
        let selectedDate: DayInfo;
        switch (this.calendarOptionSubject.getValue()) {
            case CalendarOptions.Day:
                if (selectedDay.isMonth === DayInfoMonth.Previous) {
                    this.changeMonth(false)
                } else if(selectedDay.isMonth === DayInfoMonth.Next) {
                    this.changeMonth(true)
                }
                selectedDate = this.daysInMonthSubject.getValue().find(x => x.date === selectedDay.date && x.isMonth === DayInfoMonth.Current)!;
                this.#selectDateOnDay(selectedDate);
                break;
            case CalendarOptions.Month:
                this.#selectDateOnDay(selectedDay);
                break;
            case CalendarOptions.WorkWeek:
            case CalendarOptions.Week:
                selectedDate = this.daysInMonthSubject.getValue().find(x => x.weekNumber === selectedDay.weekNumber && x.name === DayOfWeek.Monday)!;
                this.currentSelectedDaySubject.next(selectedDate);
                this.selectedWeekSubject.next(selectedDay.weekNumber);
                break;
        }
    }

    increment(): void {
        switch (this.calendarOptionSubject.getValue()) {
            case CalendarOptions.Day:
                this.#incrementDay();
                break;
            case CalendarOptions.Month:
                this.#incrementMonth();
                break;
            case CalendarOptions.WorkWeek:
            case CalendarOptions.Week:
                this.#incrementWeek();
                break;
        }
    }

    decrement(): void {
        switch (this.calendarOptionSubject.getValue()) {
            case CalendarOptions.Day:
                this.#decrementDay();
                break;
            case CalendarOptions.Month:
                this.#decrementMonth();
                break;
            case CalendarOptions.WorkWeek:
            case CalendarOptions.Week:
                this.#decrementWeek();
                break;
        }
    }

    setCalendarOption(option: CalendarOptions): void {
        this.calendarOptionSubject.next(option);
        if(option === CalendarOptions.Day || option === CalendarOptions.Month) return;

        this.selectedWeekSubject.next(this.currentSelectedDaySubject.getValue()!.weekNumber);

    }

    setCurrentDate(): void {
        const newDate = new Date();
        if(newDate.getMonth() !== this.currentSelectedDaySubject.getValue()?.month) {
            this.#generateDaysForSelectedMonth();
        }

        let currentDay = this.daysInMonthSubject.getValue().find(x => x.date === newDate.getDate() && x.isMonth === DayInfoMonth.Current)!;
        if(this.calendarOptionSubject.getValue() === CalendarOptions.Week || this.calendarOptionSubject.getValue() === CalendarOptions.WorkWeek) {
            currentDay = this.daysInMonthSubject.getValue().find(x => x.weekNumber === currentDay?.weekNumber && x.name === DayOfWeek.Monday)!;
        }

        this.#calendarDateService.setSelectedWeek(currentDay.weekNumber);

        this.currentSelectedDaySubject.next(currentDay);
        this.selectedDateSubject.next(newDate);
        this.selectedWeekSubject.next(currentDay.weekNumber);
        this.selectedMonthSubject.next(newDate.getMonth());
    }

    setSelectedDate(day: string, weekNumber: number): void {
        const selectedDay = this.daysInMonthSubject.getValue().find(x => x.weekNumber === weekNumber && x.name === day)!;
        this.currentSelectedDaySubject.next(selectedDay);
        this.selectedWeekSubject.next(weekNumber);
        const selectedDate = this.selectedDateSubject.getValue();
        selectedDate.setMonth(selectedDay.month, selectedDay.date);
        this.selectedDateSubject.next(selectedDate);
    }

    changeMonth(increment: boolean): void {
        const selectedDate = this.selectedDateSubject.getValue();
        const newDate = increment
            ? incrementMonth(selectedDate.getMonth(), selectedDate.getFullYear())
            : decrementMonth(selectedDate.getMonth(), selectedDate.getFullYear());

        selectedDate.setFullYear(newDate.year, newDate.month);

        this.selectedDateSubject.next(selectedDate);
        const previousWeeksInMonth = this.daysInMonthSubject.getValue().length / 7;
        this.#generateDaysForSelectedMonth();
        const currentWeeksInMonth = this.daysInMonthSubject.getValue().length / 7;

        if(currentWeeksInMonth < previousWeeksInMonth && this.selectedWeekSubject.getValue() === previousWeeksInMonth) {
            this.selectedWeekSubject.next(currentWeeksInMonth)
        }

        const selectedDateInNewMonth = this.daysInMonthSubject.getValue().find(x => x.date == selectedDate.getDate() && x.isMonth === DayInfoMonth.Current)!;
        this.currentSelectedDaySubject.next(selectedDateInNewMonth);
        this.selectedMonthSubject.next(newDate.month);
    }

    #generateDaysForSelectedMonth(): void {
        const currentDate = this.selectedDateSubject.getValue();
        const days: DayInfo[] = generateDaysForMonth(currentDate.getMonth(), currentDate.getFullYear());
        this.daysInMonthSubject.next(days);
    }

    #initializeCalendarService(): void {
        this.#calendarDateService.setSelectedMonth(this.selectedMonthSubject.getValue());
        this.#calendarDateService.setCurrentSelectedDay(this.currentSelectedDaySubject.getValue()!);
        this.#calendarDateService.setSelectedDate(this.selectedDateSubject.getValue());
        this.#calendarDateService.setSelectedWeek(this.selectedWeekSubject.getValue());
        this.#calendarDateService.setDaysInMonth(this.daysInMonthSubject.getValue());
    }

    #incrementDay(): void {
        const currentDays = this.daysInMonthSubject.getValue();
        const currentSelectedDay = this.currentSelectedDaySubject.getValue()!;
        const index = currentDays.indexOf(currentSelectedDay) + 1;
        let nextDay = currentDays[index];

        if (!nextDay) {
            this.changeMonth(true);
            nextDay = this.daysInMonthSubject.getValue()[7];
        }

        this.currentSelectedDaySubject.next(nextDay);
    }

    #incrementWeek(): void {
        let currentWeek = this.selectedWeekSubject.getValue()!;
        currentWeek++;
        const maxWeeks = this.daysInMonthSubject.getValue().length / 7;

        if (currentWeek <= maxWeeks) {
            this.selectedWeekSubject.next(currentWeek);
            const nextDay = this.daysInMonthSubject.getValue().find(x => x.weekNumber === currentWeek && x.name === DayOfWeek.Monday);
            this.currentSelectedDaySubject.next(nextDay!);
        } else {
            this.changeMonth(true);
            this.selectedWeekSubject.next(2);
            const nextDay = this.daysInMonthSubject.getValue().find(x => x.weekNumber === 2 && x.name === DayOfWeek.Monday);
            this.currentSelectedDaySubject.next(nextDay!);
        }
    }

    #incrementMonth(): void {
        this.changeMonth(true);
        const nextDay = this.daysInMonthSubject.getValue().find(x => x.isMonth === DayInfoMonth.Current);
        this.currentSelectedDaySubject.next(nextDay!);
    }

    #decrementDay(): void {
        const currentDays = this.daysInMonthSubject.getValue();
        const currentSelectedDay = this.currentSelectedDaySubject.getValue()!;
        const index = currentDays.indexOf(currentSelectedDay) - 1;
        let previousDay = currentDays[index];

        if(!previousDay) {
            this.changeMonth(false);
            const lastIndex = this.daysInMonthSubject.getValue().length - 1;
            previousDay = this.daysInMonthSubject.getValue()[lastIndex];
        }

        this.currentSelectedDaySubject.next(previousDay);
    }

    #decrementWeek(): void {
        let currentWeek = this.selectedWeekSubject.getValue()!;
        currentWeek--;
        if (currentWeek != 0) {
            const previousMonday = this.daysInMonthSubject.getValue().find(x => x.weekNumber === currentWeek && x.name === DayOfWeek.Monday)!;
            this.selectedWeekSubject.next(previousMonday.weekNumber);
            this.currentSelectedDaySubject.next(previousMonday);
            return;
        }

        this.changeMonth(false);
        const numberOfWeeks = this.daysInMonthSubject.getValue().length / 7;
        this.selectedWeekSubject.next(numberOfWeeks);
        const lastMonday = this.daysInMonthSubject.getValue().find(x => x.weekNumber === numberOfWeeks && x.name === DayOfWeek.Monday)!;
        this.currentSelectedDaySubject.next(lastMonday);
    }

    #decrementMonth(): void {
        const currentSelectedDay = this.currentSelectedDaySubject.getValue();
        this.changeMonth(false);
        const nextDay = this.daysInMonthSubject.getValue().find(x => x.isMonth === DayInfoMonth.Current && x.date === currentSelectedDay!.date);
        this.currentSelectedDaySubject.next(nextDay!);
0    }

    #selectDateOnDay(selectedDay: DayInfo) {
        const newDate = this.selectedDateSubject.getValue();
        newDate.setDate(selectedDay.date)
        this.currentSelectedDaySubject.next(selectedDay);
        this.selectedWeekSubject.next(selectedDay.weekNumber);
        this.selectedDateSubject.next(newDate);
    }
}
