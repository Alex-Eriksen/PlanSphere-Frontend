import {
    Component, DestroyRef,
    ElementRef,
    inject,
    input,
    OnChanges, OnInit, SimpleChanges,
    ViewChild
} from "@angular/core";
import { CalendarOptions } from "../enums/calendar-options.enum";
import { IWorkSchedule } from "../../core/features/workSchedules/models/work-schedule.model";
import { DayOfWeek } from "../enums/day-of-week.enum";
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

@Component({
  selector: 'ps-calender-table',
  standalone: true,
    imports: [
        NgClass,
        SmallHeaderComponent,
        ButtonComponent,
        TranslateModule,
        NgIf,
        CalendarTableColumnComponent
    ],
  templateUrl: './calender-table.component.html',
  styleUrl: './calender-table.component.scss'
})
export class CalenderTableComponent implements OnInit, OnChanges {
    @ViewChild('workHoursTable') workHoursTable!: ElementRef;
    #calendarDateService = inject(CalendarDateService);
    #calendarFacadeService = inject(CalendarFacadeService);
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

    weeksInMonth: number[] = []
    hours: number[] = Array.from({ length: 24 }, (_, i) => i);

    ngOnInit() {
        this.weeksInMonth = Array(this.daysInMonth().length / 7).fill(0);

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

    openWorkTimePopup (workTime: IWorkTime | undefined) {
        let workTimes: IWorkTime[] = [];
        if(workTime !== undefined) {
            workTimes = this.#calendarDateService.getWorkTimesOnDate(workTime.startDateTime.getDate(), workTime.startDateTime.getMonth());
        }

        this.#matDialog.open<WorkTimePopupComponent, IWorkTimePopupInputs>(WorkTimePopupComponent, {
            data: {
                currentWorkTime: workTime,
                isEditPopup: !!workTime,
                workTimes: workTimes
            }
        }).afterClosed()
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(result => {
                if (result) {
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

    protected readonly DayOfWeek = DayOfWeek;
    protected readonly Object = Object;
    protected readonly CalendarOptions = CalendarOptions;
    protected readonly length = length;
}
