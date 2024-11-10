import { Component, inject, input, OnInit } from "@angular/core";
import { ButtonComponent } from "../button/button.component";
import { CalendarSidePanelComponent } from "../calendar-side-panel/calendar-side-panel.component";
import { CalenderTableComponent } from "../calender-table/calender-table.component";
import { LoadingOverlayComponent } from "../loading-overlay/loading-overlay.component";
import { NgIf } from "@angular/common";
import { FormArray, FormControl } from "@angular/forms";
import { CalendarOptions } from "../enums/calendar-options.enum";
import { DayInfo } from "../interfaces/day-info.interface";
import { IWorkSchedule } from "../../core/features/workSchedules/models/work-schedule.model";
import { DayInfoMonth } from "../enums/day-info-month.enum";
import {
    decrementMonth,
    generateDaysForMonth,
    incrementMonth
} from "../../views/main/components/frontpage/calendar.utilities";
import { DayOfWeek } from "../enums/day-of-week.enum";
import { IWorkHour } from "../interfaces/work-hour.interface";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { CalendarDateService } from "../../core/services/calendar-date.service";

@Component({
  selector: 'ps-calendar',
  standalone: true,
  providers: [CalendarDateService],

    imports: [
        ButtonComponent,
        CalendarSidePanelComponent,
        CalenderTableComponent,
        LoadingOverlayComponent,
        NgIf
    ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
    readonly #breakpointObserver = inject(BreakpointObserver);
    #calendarDateService = inject(CalendarDateService);

    selectedDate = input.required<FormControl<Date>>();
    currentDate = input.required<FormControl<Date>>();
    currentSelectedDay = input.required<FormControl<DayInfo>>();
    calendarOption = input.required<FormControl<CalendarOptions>>();
    selectedWeek = input.required<FormControl<number | null>>();
    selectedMonth = input.required<FormControl<number>>();
    workSchedule = input.required<FormControl<IWorkSchedule>>();
    workHours = input.required<FormControl<IWorkHour[]>>();
    hasIncremented = input.required<FormControl<boolean>>();
    setCurrentDate = input.required<FormControl<any>>();
    daysInMonth = input.required<FormArray<FormControl<DayInfo>>>();

    hideSidePanel = false;

    ngOnInit(): void {
        this.#generateDaysForSelectedMonth();
        const currentDate = this.daysInMonth().value.find(x => x.date === this.currentDate().value.getDate() && x.month === this.currentDate().value.getMonth())!;

        this.currentSelectedDay().patchValue(currentDate);
        this.selectedMonth().patchValue(currentDate.month, {emitEvent: false});
        this.selectedWeek().patchValue(currentDate.weekNumber);


        this.setCurrentDate().valueChanges.subscribe(() => {
            const newDate = new Date();

            this.selectedDate().patchValue(newDate);
            this.selectedMonth().patchValue(newDate.getMonth());
            this.#calendarDateService.setSelectedMonth(currentDate.month);

            if(this.calendarOption().value === CalendarOptions.Day) {
                const nextIndex = this.daysInMonth().value.find(x => x!.date === this.currentDate().value.getDate() && x!.isMonth === DayInfoMonth.Current);
                this.currentSelectedDay().patchValue(nextIndex!)
                this.#calendarDateService.setCurrentSelectedDay(nextIndex!);
            }

            if(this.calendarOption().value === CalendarOptions.WorkWeek || this.calendarOption().value === CalendarOptions.Week) {
                const nextIndex = this.daysInMonth().value.find(x => x!.date === this.currentDate().value.getDate() && x!.isMonth === DayInfoMonth.Current);
                this.selectedWeek().patchValue(nextIndex!.weekNumber);
                this.#calendarDateService.setSelectedWeek(currentDate.weekNumber);

                this.currentSelectedDay().patchValue(nextIndex!)
            }
        });

        this.selectedMonth().valueChanges.subscribe((value: number) => {
            if(this.selectedDate().value.getMonth() + 1 === value)
                this.changeMonth(true);

            if(this.selectedDate().value.getMonth() - 1 === value)
                this.changeMonth(false);

            this.#calendarDateService.setSelectedMonth(this.selectedMonth().value);

            const nextDay = this.daysInMonth().value.find(x => x!.isMonth === DayInfoMonth.Current); // find first day in next month
            this.currentSelectedDay().patchValue(nextDay!);
        })

        this.currentSelectedDay().valueChanges.subscribe((date) => {
            this.#calendarDateService.setCurrentSelectedDay(date);
        })

        this.selectedWeek().valueChanges.subscribe((week) => {
            this.#calendarDateService.setSelectedWeek(week);
        })

        this.daysInMonth().valueChanges.subscribe((days) => {
            this.#calendarDateService.setDaysInMonth(days);
        })

        this.calendarOption().valueChanges.subscribe(() => {
            this.setCurrentDate().patchValue(null);
        });

        this.hasIncremented().valueChanges.subscribe((value: boolean) => {
            value ? this.increment() : this.decrement();
        })

        this.#breakpointObserver
            .observe(['(max-width: 850px)'])
            .subscribe((state: BreakpointState) => {
                this.hideSidePanel = state.matches;
            });

        this.#initializeCalendarService();
    }

    increment(): void {
        switch (this.calendarOption().value) {
            case CalendarOptions.Day: {
                const index = this.daysInMonth().value.indexOf(this.currentSelectedDay().value) + 1; // Gets index of the current selected day and increments to fetch next value
                let nextDay = this.daysInMonth().value[index]; // if this is undefined, has reached end of month

                if(nextDay === undefined) { // if undefined
                    this.changeMonth(true);
                    nextDay = this.daysInMonth().value[7];
                }

                this.currentSelectedDay().patchValue(nextDay!)
                break;
            }
            case CalendarOptions.Month: { // increment month, and select first day
                this.changeMonth(true);
                const nextDay = this.daysInMonth().value.find(x => x!.isMonth === DayInfoMonth.Current); // find first day in next month
                this.currentSelectedDay().patchValue(nextDay!);
                break;
            }
            case CalendarOptions.WorkWeek:
            case CalendarOptions.Week: {
                this.selectedWeek().patchValue(this.selectedWeek().value! + 1);
                const maxWeeks = this.daysInMonth().value.length / 7;
                if(this.selectedWeek().value! <= maxWeeks) { // if selected week hasn't reached max (5 or 6), increment by one week and select monday.
                    const nextDay = this.daysInMonth().value.find(x => x.weekNumber === this.selectedWeek().value && x.name === DayOfWeek.Monday);
                    this.currentSelectedDay().patchValue(nextDay!)
                    return;
                }

                this.changeMonth(true);
                this.selectedWeek().patchValue(2);
                const nextDay = this.daysInMonth().value.find(x => x.weekNumber === this.selectedWeek().value && x.name === DayOfWeek.Monday);
                this.currentSelectedDay().patchValue(nextDay!)
                break;
            }
        }
    }

    decrement(): void {
        switch (this.calendarOption().value) {
            case CalendarOptions.Day: {
                const index = this.daysInMonth().value.indexOf(this.currentSelectedDay().value) - 1; // Gets index of the current selected day and increments to fetch next value
                let previousDay = this.daysInMonth().value[index]; // if this is undefined, has reached end of month

                if(previousDay === undefined) { // if undefined, generate new month and assign last day of month
                    this.changeMonth(false);
                    const lastIndex = this.daysInMonth().value.length - 1;
                    previousDay = this.daysInMonth().value[lastIndex];
                }

                this.currentSelectedDay().patchValue(previousDay!)
                break;
            }
            case CalendarOptions.Month: { // increment month, and select first day
                this.changeMonth(false);
                const nextDay = this.daysInMonth().value.find(x => x!.isMonth === DayInfoMonth.Current); // find first day in next month
                this.currentSelectedDay().patchValue(nextDay!);
                break;
            }
            case CalendarOptions.WorkWeek:
            case CalendarOptions.Week: {
                this.selectedWeek().patchValue(this.selectedWeek().value! - 1);
                if(this.selectedWeek().value! != 0) { // if selected week hasn't reached minimum (1), decrement by one week and select monday.
                    const previousMonday = this.daysInMonth().value.find(x => x.weekNumber === this.selectedWeek().value && x.name === DayOfWeek.Monday);
                    this.currentSelectedDay().patchValue(previousMonday!)
                    return;
                }

                this.changeMonth(false);
                const numberOfWeeks = (this.daysInMonth().value.length / 7) - 1;
                this.selectedWeek().patchValue(numberOfWeeks);
                const lastMondayOfMonth = this.daysInMonth().value.find(x => x.weekNumber === numberOfWeeks && x.name === DayOfWeek.Monday);
                this.currentSelectedDay().patchValue(lastMondayOfMonth!)
                break;
            }
        }
    }

    changeMonth(increment: boolean): void {
        const selectedDate = increment ?
            incrementMonth(this.selectedDate().value.getMonth(), this.selectedDate().value.getFullYear()) :
            decrementMonth(this.selectedDate().value.getMonth(), this.selectedDate().value.getFullYear());

        this.selectedDate().value.setFullYear(selectedDate.year, selectedDate.month);
        this.#calendarDateService.setSelectedDate(this.selectedDate().value);
        this.selectedMonth().patchValue(selectedDate.month, {emitEvent: false});
        this.#generateDaysForSelectedMonth();
    }

    #generateDaysForSelectedMonth(isInitial: boolean = false): void {
        const month = isInitial ? this.currentDate().value.getMonth() : this.selectedDate().value.getMonth();
        const year = isInitial ? this.currentDate().value.getFullYear() : this.selectedDate().value.getFullYear();

        const days: DayInfo[] = generateDaysForMonth(month, year);

        this.daysInMonth().clear();
        days.forEach(day => {
            const newControl = new FormControl<DayInfo>(day, {nonNullable: true});
            this.daysInMonth().push(newControl);
        });
    }

    #initializeCalendarService(): void {
        this.#calendarDateService.setSelectedMonth(this.selectedMonth().value);
        this.#calendarDateService.setCurrentSelectedDay(this.currentSelectedDay().value);
        this.#calendarDateService.setSelectedDate(this.selectedDate().value);
        this.#calendarDateService.setSelectedWeek(this.selectedWeek().value);
        this.#calendarDateService.setDaysInMonth(this.daysInMonth().value);
    }

    protected readonly CalendarOptions = CalendarOptions;
}
