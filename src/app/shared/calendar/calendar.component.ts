import { Component, DestroyRef, inject, input, OnInit } from "@angular/core";
import { ButtonComponent } from "../button/button.component";
import { CalendarSidePanelComponent } from "../calendar-side-panel/calendar-side-panel.component";
import { CalenderTableComponent } from "../calender-table/calender-table.component";
import { LoadingOverlayComponent } from "../loading-overlay/loading-overlay.component";
import { NgIf } from "@angular/common";
import { CalendarOptions } from "../enums/calendar-options.enum";
import { DayInfo } from "../interfaces/day-info.interface";
import { IWorkSchedule } from "../../core/features/workSchedules/models/work-schedule.model";
import { IWorkHour } from "../interfaces/work-hour.interface";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { CalendarDateService } from "../../core/services/calendar-date.service";
import { CalendarFacadeService } from "../../core/services/calendar.facade.service";
import { generateWorkHours } from "../../views/main/components/frontpage/calendar.utilities";
import { Subject } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'ps-calendar',
  standalone: true,
  providers: [CalendarDateService, CalendarFacadeService],

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
    readonly #calendarDateService = inject(CalendarDateService);
    readonly #calendarFacadeService = inject(CalendarFacadeService);

    #destroyRef = inject(DestroyRef)

    workSchedule = input.required<IWorkSchedule>();

    selectedDate: Date = new Date();
    currentDate: Date = new Date();
    currentSelectedDay: DayInfo | null = null
    calendarOption: CalendarOptions = CalendarOptions.Day;
    selectedWeek: number | null = null;
    selectedMonth: number = new Date().getMonth();
    workHours: IWorkHour[] = [];
    daysInMonth: DayInfo[] = [];

    hideSidePanel = false;
    isLoading: boolean = false;

    ngOnInit(): void {
        this.isLoading = true;
        this.#subscribeToCalendarChanges();
        this.#subscribeToBreakpointChanges();

        this.workHours = generateWorkHours(this.workSchedule());

        this.#calendarFacadeService.initializeCalendar(
            this.selectedDate,
            this.currentDate,
            this.calendarOption,
            this.selectedWeek,
            this.selectedMonth,
            this.daysInMonth
        );

        this.#calendarFacadeService.setCurrentDate();
        this.isLoading = false;
    }

    #subscribeToCalendarChanges(): void {
        this.#calendarFacadeService.selectedDate$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(date => {
                this.selectedDate = date;
                this.#calendarDateService.setSelectedDate(date);
            });

        this.#calendarFacadeService.currentDate$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(date => this.currentDate = date);

        this.#calendarFacadeService.currentSelectedDay$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(day => {
                this.currentSelectedDay = day;
                this.#calendarDateService.setCurrentSelectedDay(day!);
            });

        this.#calendarFacadeService.calendarOption$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(option => this.calendarOption = option);

        this.#calendarFacadeService.selectedWeek$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(week => {
                this.selectedWeek = week;
                this.#calendarDateService.setSelectedWeek(week);
            });

        this.#calendarFacadeService.selectedMonth$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(month => {
                this.selectedMonth = month;
                this.#calendarDateService.setSelectedMonth(month);
            });

        this.#calendarFacadeService.daysInMonth$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(days => {
                this.daysInMonth = days;
                this.#calendarDateService.setDaysInMonth(days);
            });
    }


    #subscribeToBreakpointChanges(): void {
        this.#breakpointObserver
            .observe(['(max-width: 850px)'])
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((state: BreakpointState) => {
                this.hideSidePanel = state.matches;
            });
    }
}
