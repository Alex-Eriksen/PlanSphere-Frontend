import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FormArray, FormBuilder, FormControl } from "@angular/forms";
import { CalendarDateService } from "./calendar-date.service";
import {
    decrementMonth,
    generateDaysForMonth,
    getDayOfWeek,
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

    constructor(
        private fb: FormBuilder,
        private calendarDateService: CalendarDateService
    ) {}

    initializeCalendar(
        selectedDate: FormControl<Date>,
        currentDate: FormControl<Date>,
        currentSelectedDay: FormControl<DayInfo>,
        calendarOption: FormControl<CalendarOptions>,
        selectedWeek: FormControl<number | null>,
        selectedMonth: FormControl<number>,
        daysInMonth: FormArray<FormControl<DayInfo>>
    ): void {
        this.selectedDateSubject.next(selectedDate.value);
        this.currentDateSubject.next(currentDate.value);
        this.currentSelectedDaySubject.next(currentSelectedDay.value);
        this.calendarOptionSubject.next(calendarOption.value);
        this.selectedWeekSubject.next(selectedWeek.value);
        this.selectedMonthSubject.next(selectedMonth.value);
        this.daysInMonthSubject.next(daysInMonth.value);

        this.#generateDaysForSelectedMonth();
        this.#initializeCalendarService();
        const selectedDay = this.daysInMonthSubject.getValue().find(day => day.month === currentDate.value.getMonth() && day.date === currentDate.value.getDate())!;
        this.currentSelectedDaySubject.next(selectedDay);
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

        let currentDay = this.daysInMonthSubject.getValue().find(x => x.date === newDate.getDate() && x.name === getDayOfWeek(newDate))!;

        if(this.calendarOptionSubject.getValue() !== CalendarOptions.Day || this.calendarOptionSubject.getValue() !== CalendarOptions.Month) {
            currentDay = this.daysInMonthSubject.getValue().find(x => x.weekNumber === currentDay?.weekNumber && x.name === DayOfWeek.Monday)!;
            this.selectedWeekSubject.next(currentDay.weekNumber);
        }

        this.currentSelectedDaySubject.next(currentDay);
        this.selectedDateSubject.next(newDate);
        this.selectedMonthSubject.next(newDate.getMonth());
    }

    changeMonth(increment: boolean): void {
        const currentDate = this.selectedDateSubject.getValue();
        const newDate = increment
            ? incrementMonth(currentDate.getMonth(), currentDate.getFullYear())
            : decrementMonth(currentDate.getMonth(), currentDate.getFullYear());

        currentDate.setFullYear(newDate.year, newDate.month);
        this.selectedDateSubject.next(currentDate);
        this.selectedMonthSubject.next(newDate.month);
        this.#generateDaysForSelectedMonth();
        this.calendarDateService.setSelectedDate(currentDate);
    }

    #generateDaysForSelectedMonth(): void {
        const currentDate = this.selectedDateSubject.getValue();
        const days: DayInfo[] = generateDaysForMonth(currentDate.getMonth(), currentDate.getFullYear());
        this.daysInMonthSubject.next(days);
    }

    #initializeCalendarService(): void {
        this.calendarDateService.setSelectedMonth(this.selectedMonthSubject.getValue());
        this.calendarDateService.setCurrentSelectedDay(this.currentSelectedDaySubject.getValue()!);
        this.calendarDateService.setSelectedDate(this.selectedDateSubject.getValue());
        this.calendarDateService.setSelectedWeek(this.selectedWeekSubject.getValue());
        this.calendarDateService.setDaysInMonth(this.daysInMonthSubject.getValue());
    }

    #incrementDay(): void {
        const currentDays = this.daysInMonthSubject.getValue();
        console.log(currentDays);
        const currentSelectedDay = this.currentSelectedDaySubject.getValue()!;
        console.log(currentSelectedDay);
        const index = currentDays.indexOf(currentSelectedDay) + 1;
        console.log(index);
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

        if(!previousDay) { // if undefined, generate new month and assign last day of month
            this.changeMonth(false);
            const lastIndex = this.daysInMonthSubject.getValue().length - 1;
            previousDay = this.daysInMonthSubject.getValue()[lastIndex];
        }

        this.currentSelectedDaySubject.next(previousDay);
    }

    #decrementWeek(): void {
        let currentWeek = this.selectedWeekSubject.getValue()!;
        currentWeek--;
        console.log(currentWeek);
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
}
