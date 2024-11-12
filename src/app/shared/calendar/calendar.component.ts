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
import { IWorkHour } from "../interfaces/work-hour.interface";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { CalendarDateService } from "../../core/services/calendar-date.service";
import { Subject, takeUntil } from "rxjs";
import { CalendarFacadeService } from "../../core/services/calendar.facade.service";

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
    #calendarFacadeService = inject(CalendarFacadeService);
    #destroy$ = new Subject<void>();

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
        this.#subscribeToCalendarChanges();
        this.#subscribeToFormControlChanges();
        this.#subscribeToBreakpointChanges();

        this.#calendarFacadeService.initializeCalendar(
            this.selectedDate(),
            this.currentDate(),
            this.currentSelectedDay(),
            this.calendarOption(),
            this.selectedWeek(),
            this.selectedMonth(),
            this.daysInMonth()
        );

        console.log(this.calendarOption().value)

        const currentDate = this.daysInMonth().value.find(x => x.date === this.currentDate().value.getDate() && x.month === this.currentDate().value.getMonth())!

        this.currentSelectedDay().patchValue(currentDate);
        this.selectedMonth().patchValue(currentDate.month, {emitEvent: false});
        this.selectedWeek().patchValue(currentDate.weekNumber);
    }

    #subscribeToCalendarChanges(): void {
        this.#calendarFacadeService.selectedDate$
            .pipe(takeUntil(this.#destroy$))
            .subscribe(date => {
                this.selectedDate().setValue(date);
                this.#calendarDateService.setSelectedDate(date);
            });

        this.#calendarFacadeService.currentDate$
            .pipe(takeUntil(this.#destroy$))
            .subscribe(date => this.currentDate().setValue(date));

        this.#calendarFacadeService.currentSelectedDay$
            .pipe(takeUntil(this.#destroy$))
            .subscribe(day => this.currentSelectedDay().setValue(day!));

        this.#calendarFacadeService.calendarOption$
            .pipe(takeUntil(this.#destroy$))
            .subscribe(option => this.calendarOption().setValue(option));

        this.#calendarFacadeService.selectedWeek$
            .pipe(takeUntil(this.#destroy$))
            .subscribe(week => {
                this.selectedWeek().setValue(week);
                this.#calendarDateService.setSelectedWeek(week);
            });

        this.#calendarFacadeService.selectedMonth$
            .pipe(takeUntil(this.#destroy$))
            .subscribe(month => {
                this.selectedMonth().setValue(month)
                this.#calendarDateService.setSelectedMonth(month);
            });

        this.#calendarFacadeService.daysInMonth$
            .pipe(takeUntil(this.#destroy$))
            .subscribe(days => {
                this.daysInMonth().clear();
                days.forEach(day => {
                    this.daysInMonth().push(new FormControl<DayInfo>(day, { nonNullable: true }));
                });
                this.#calendarDateService.setDaysInMonth(days);
            });
    }

    onNextButtonClick() {
        this.#calendarFacadeService.increment();
    }

    onPreviousButtonClick() {
        this.#calendarFacadeService.decrement();
    }

    onCalendarOptionChange(option: CalendarOptions) {
        this.#calendarFacadeService.setCalendarOption(option);
    }

    onCurrentDateButtonClick() {
        this.#calendarFacadeService.setCurrentDate();
    }


    #subscribeToFormControlChanges(): void {
        this.setCurrentDate().valueChanges.subscribe(() => {
            const newDate = new Date();

            this.selectedDate().patchValue(newDate);
            this.selectedMonth().patchValue(newDate.getMonth());
            this.#calendarDateService.setSelectedMonth(newDate.getMonth());

            if(this.calendarOption().value === CalendarOptions.Day) {
                const nextIndex = this.daysInMonth().value.find(x => x!.date === this.currentDate().value.getDate() && x!.isMonth === DayInfoMonth.Current);
                this.currentSelectedDay().patchValue(nextIndex!)
                this.#calendarDateService.setCurrentSelectedDay(nextIndex!);
            }

            if(this.calendarOption().value === CalendarOptions.WorkWeek || this.calendarOption().value === CalendarOptions.Week) {
                const nextIndex = this.daysInMonth().value.find(x => x!.date === this.currentDate().value.getDate() && x!.isMonth === DayInfoMonth.Current);
                this.selectedWeek().patchValue(nextIndex!.weekNumber);
                this.#calendarDateService.setSelectedWeek(nextIndex!.weekNumber);

                this.currentSelectedDay().patchValue(nextIndex!)
            }
        });

        this.selectedMonth().valueChanges.subscribe((value: number) => {
            if(this.selectedDate().value.getMonth() + 1 === value)
                this.#calendarFacadeService.changeMonth(true);

            if(this.selectedDate().value.getMonth() - 1 === value)
                this.#calendarFacadeService.changeMonth(false);

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

    }

    #subscribeToBreakpointChanges(): void {
        this.#breakpointObserver
            .observe(['(max-width: 850px)'])
            .pipe(takeUntil(this.#destroy$))
            .subscribe((state: BreakpointState) => {
                this.hideSidePanel = state.matches;
            });
    }


    protected readonly CalendarOptions = CalendarOptions;
}
