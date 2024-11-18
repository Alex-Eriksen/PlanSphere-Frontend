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
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { WorkTimeService } from "../../core/features/workTimes/services/work-time.service";
import { IWorkTime } from "../../core/features/workTimes/models/work-time.models";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { ToastService } from "../../core/services/error-toast.service";

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
    readonly #workTimeService = inject(WorkTimeService);
    readonly #destroyRef = inject(DestroyRef)
    readonly #toastService = inject(ToastService);

    workSchedule = input.required<IWorkSchedule>();

    selectedDate: Date = new Date();
    currentDate: Date = new Date();
    currentSelectedDay: DayInfo | null = null
    calendarOption: CalendarOptions = CalendarOptions.Day;
    selectedWeek: number | null = null;
    selectedMonth: number = new Date().getMonth();
    workHours: IWorkHour[] = [];
    daysInMonth: DayInfo[] = [];

    workTimes: IWorkTime[] = [];

    hideSidePanel: boolean = false;
    hideHeader: boolean = false;
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
        this.#calendarFacadeService.refreshTable();
    }

    onCheckButtonClick(): void {
        if(!this.#calendarDateService.hasCheckedIn()) {
            this.#checkIn();
        } else {
            this.#checkOut();
        }
    }

    #checkIn(): void {
        this.#workTimeService.checkIn()
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe({
                error: () => {
                    this.#toastService.showToast('CALENDAR.ERRORS.CHECK_IN');
                },
                complete: () => {
                    this.#toastService.showToast('CALENDAR.CHECK_IN');
                    this.#calendarFacadeService.refreshTable()
                }
            })
    }

    #checkOut(): void {
        this.#workTimeService.checkOut()
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe({
                error: () => {
                    this.#toastService.showToast('CALENDAR.ERRORS.CHECK_OUT');
                },
                complete: () => {
                    this.#toastService.showToast('CALENDAR.CHECKED_OUT');
                    this.#calendarFacadeService.refreshTable()
                }
        })
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
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                tap(() => {
                }),
                switchMap(month =>
                    this.#workTimeService.getWorkTimesInMonth({
                        year: this.selectedDate.getFullYear(),
                        month: month + 1
                    }).pipe(
                        catchError(error => {
                            console.error('Error fetching work times:', error);
                            return of([]);
                        }),
                        map(workTimes => ({
                            workTimes, month
                        }))
                    )
                )
            )
            .subscribe(({ workTimes, month }) => {
                workTimes.forEach(workTime => {
                    workTime.startDateTime.setMinutes(Math.round(workTime.startDateTime.getMinutes() / 30) * 30, 0, 0);
                    if (workTime.endDateTime) {
                        workTime.endDateTime.setMinutes(Math.round(workTime.endDateTime.getMinutes() / 30) * 30, 0, 0);
                    }
                });
                this.workTimes = workTimes;
                this.selectedMonth = month;
                this.#calendarDateService.setSelectedMonth(month);
                this.#calendarDateService.setWorkTimes(this.workTimes);
                this.#calendarFacadeService.setWorkTimes(this.workTimes);
                this.isLoading = false;
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
            .observe(['(max-width: 1000px)'])
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((state: BreakpointState) => {
                this.hideSidePanel = state.matches;
                this.hideHeader = state.matches;
            });
    }
}
