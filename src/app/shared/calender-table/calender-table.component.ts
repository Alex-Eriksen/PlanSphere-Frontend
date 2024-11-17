import {
    Component, DestroyRef,
    ElementRef,
    inject,
    input,
    OnChanges, OnInit, output, SimpleChanges,
    ViewChild
} from "@angular/core";
import { CalendarOptions } from "../enums/calendar-options.enum";
import { IWorkSchedule } from "../../core/features/workSchedules/models/work-schedule.model";
import { NgClass, NgIf } from "@angular/common";
import { IWorkHour } from "../interfaces/work-hour.interface";
import { SmallHeaderComponent } from "../small-header/small-header.component";
import { ButtonComponent } from "../button/button.component";
import { DayInfo } from "../interfaces/day-info.interface";
import { CalendarDateService } from "../../core/services/calendar-date.service";
import { TranslateModule } from "@ngx-translate/core";
import { CalendarFacadeService } from "../../core/services/calendar.facade.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IWorkTime } from "../../core/features/workTimes/models/work-time.models";
import { MatDialog } from "@angular/material/dialog";
import { WorkTimePopupComponent } from "../work-time-popup/work-time-popup.component";
import { IWorkTimePopupInputs } from "../work-time-popup/work-time-popup-inputs.interface";
import { CalendarTableColumnComponent } from "../calendar-table-column/calendar-table-column.component";
import { AuthenticationService } from "../../core/features/authentication/services/authentication.service";
import { ISourceLevelRights } from "../../core/features/authentication/models/source-level-rights.model";
import { LoadingOverlayComponent } from "../loading-overlay/loading-overlay.component";
import { DayOfWeek } from "../../core/enums/day-of-week.enum";
import { generateHours } from "../../views/main/components/frontpage/calendar.utilities";
import { IWorkTimeData } from "../interfaces/work-time-popup.interface";

@Component({
  selector: 'ps-calender-table',
  standalone: true,
    imports: [
        NgClass,
        SmallHeaderComponent,
        ButtonComponent,
        TranslateModule,
        NgIf,
        CalendarTableColumnComponent,
        LoadingOverlayComponent
    ],
  templateUrl: './calender-table.component.html',
  styleUrl: './calender-table.component.scss'
})
export class CalenderTableComponent implements OnInit, OnChanges {
    @ViewChild('workHoursTable') workHoursTable!: ElementRef;
    #calendarDateService = inject(CalendarDateService);
    #calendarFacadeService = inject(CalendarFacadeService);
    #authenticationService = inject(AuthenticationService);
    #destroyRef = inject(DestroyRef)
    #matDialog = inject(MatDialog)

    calendarOption = input.required<CalendarOptions>();
    currentDate = input.required<Date>();
    selectedDate = input.required<Date>();
    workSchedule = input.required<IWorkSchedule>();
    workHours = input.required<IWorkHour[]>();
    selectedWeek = input.required<number | null>();
    selectedMonth = input.required<number>();
    daysInMonth = input.required<DayInfo[]>();
    currentSelectedDay = input.required<DayInfo>();
    workTimes = input.required<IWorkTime[]>();
    hideHeader = input.required<boolean>();

    onCheckButtonClick = output<void>();

    weeksInMonth: number[] = []
    hours: number[] = generateHours();
    rights!: ISourceLevelRights;
    isLoading = false;

    ngOnInit() {
        this.isLoading = true;
        this.weeksInMonth = Array(this.daysInMonth().length / 7).fill(0);

        this.#authenticationService.getRights()
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(rights => this.rights = rights);

        this.#calendarFacadeService.selectedMonth$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                if (this.calendarOption() === CalendarOptions.Month) {
                    this.weeksInMonth = Array(this.daysInMonth().length / 7).fill(0);
                    return;
                }
                this.#scrollToFirstWorkHour();
            });

        this.#calendarFacadeService.calendarOption$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((value: CalendarOptions) => {
                if(value === CalendarOptions.Month) return;
                this.#scrollToFirstWorkHour();
            });
        this.isLoading = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['daysInMonth']) {
            if (this.calendarOption() === CalendarOptions.Month) {
                this.weeksInMonth = Array(this.daysInMonth().length / 7).fill(0);
                return;

            }
            this.#scrollToCurrentWorkHour();
        }
    }

    openWorkTimePopup (data: IWorkTimeData) {
        if(!this.rights.hasManuallySetOwnWorkTimeRights) return;

        if(this.hideHeader()) return;

        let workTimes: IWorkTime[];
        const startDate = new Date();

        if(data.workTime !== undefined) {
            workTimes = this.#calendarDateService.getWorkTimesOnDate(data.workTime.startDateTime.getDate(), data.workTime.startDateTime.getMonth());
        } else {
            const day = this.daysInMonth().find(x => x.name === data.dayOfWeek && x.weekNumber === this.selectedWeek())!;
            workTimes = this.#calendarDateService.getWorkTimesOnDate(day.date, day.month);
            startDate.setMonth(day.month, day.date);
            startDate.setHours(data.hour, data.firstHalfHour? 0 : 30, 0, 0);
        }

        this.#matDialog.open<WorkTimePopupComponent, IWorkTimePopupInputs>(WorkTimePopupComponent, {
            data: {
                currentWorkTime: data.workTime,
                isEditPopup: !!data.workTime,
                workTimes: workTimes,
                startDate: startDate
            }
        }).afterClosed()
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((result?: boolean) => {
                if (result !== null && result === true) {
                    this.#calendarFacadeService.refreshTable();
                }
            })
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

    getHeaderDate(): string {
        switch (this.calendarOption()) {
            case CalendarOptions.Day:
                return this.#calendarDateService.formatDayHeader();
            case CalendarOptions.WorkWeek:
                return this.#calendarDateService.formatWorkWeekHeader(this.workSchedule());
            case CalendarOptions.Week:
                return this.#calendarDateService.formatWeekHeader();
            case CalendarOptions.Month:
                return this.#calendarDateService.formatMonthHeader();
        }
    }

    getDate(day?: string, weekNumber?: number): string {
        switch (this.calendarOption()) {
            case CalendarOptions.Day:
                return this.#calendarDateService.getDayDate();
            case CalendarOptions.WorkWeek:
            case CalendarOptions.Week:
                return this.#calendarDateService.getWeekDate(day!);
            case CalendarOptions.Month: {
                return this.#calendarDateService.getMonthDate(day!, weekNumber!);
            }
        }
    }

    isSelectedDayCurrentDate(): boolean {
        return this.#calendarDateService.isSelectedDayCurrentDate();
    }

    isSelectedDateOfWeek(dayName: string): boolean {
        return this.#calendarDateService.isSelectedDateOfWeek(dayName);
    }

    #scrollToFirstWorkHour(): void {
        if (!this.workHoursTable) return;

        const workHour = this.workHours().find(hour => hour.isWorkHour)!.id - 1;
        const tableElement = this.workHoursTable.nativeElement as HTMLElement;
        const rows = tableElement.querySelectorAll('tr');

        const currentHourRow = Array.from(rows).find(row => row.textContent?.trim() === String(workHour)) as HTMLElement;

        if (currentHourRow) {
            currentHourRow.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    #scrollToCurrentWorkHour(): void {
        if (!this.workHoursTable) return;

        const currentHour = new Date().getHours();
        const tableElement = this.workHoursTable.nativeElement as HTMLElement;
        const rows = tableElement.querySelectorAll('tr');

        const currentHourRow = Array.from(rows).find(row => row.textContent?.trim() === String(currentHour - 1)) as HTMLElement;

        if (currentHourRow) {
            currentHourRow.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    protected castStringToDayOfWeek(day: string): DayOfWeek {
        return day as DayOfWeek;
    }

    hasCheckedIn = (): boolean => this.#calendarDateService.hasCheckedIn();

    protected readonly DayOfWeek = DayOfWeek;
    protected readonly Object = Object;
    protected readonly CalendarOptions = CalendarOptions;
    protected readonly length = length;
}
