import { Component, DestroyRef, inject, input, OnChanges, OnInit, output, SimpleChanges } from "@angular/core";
import { CalendarOptions } from "../enums/calendar-options.enum";
import { NgClass, NgIf } from "@angular/common";
import { CalendarDateService } from "../../core/services/calendar-date.service";
import { IWorkHour } from "../interfaces/work-hour.interface";
import { IWorkTime } from "../../core/features/workTimes/models/work-time.models";
import { CalendarFacadeService } from "../../core/services/calendar.facade.service";
import { WorkTimeType } from "../../core/features/workTimes/models/work-time-type.interface";
import { DayOfWeek } from "../../core/enums/day-of-week.enum";
import { IWorkTimeData } from "../interfaces/work-time-popup.interface";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'ps-calendar-table-column',
  standalone: true,
    imports: [
        NgClass,
        NgIf
    ],
  templateUrl: './calendar-table-column.component.html',
  styleUrl: './calendar-table-column.component.scss'
})
export class CalendarTableColumnComponent implements OnInit, OnChanges {
    readonly #calendarDateService = inject(CalendarDateService);
    readonly #calendarFacadeService = inject(CalendarFacadeService);
    readonly #destroyRef = inject(DestroyRef)
    dayOfWeek = input.required<DayOfWeek>();
    hour = input.required<number>();
    isFirstHalfHour = input.required<boolean>();
    calendarOption = input<CalendarOptions>();
    workHours = input<IWorkHour[]>();
    weekNumber = input<number>();

    columnClick = output<IWorkTimeData>();

    columnClasses: string[] = [];
    workTime: IWorkTime | undefined;

    ngOnInit() {
        this.#calendarFacadeService.workTimes$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                this.getCellClasses();
            });
    }


    ngOnChanges(changes: SimpleChanges) {
        if(changes['dayOfWeek'] || changes['weekNumber']) {
            this.getCellClasses()
        }
    }

    onColumnClick() {
        const workTimeData: IWorkTimeData = {
            workTime: this.workTime,
            dayOfWeek: this.dayOfWeek()!,
            hour: this.hour()!,
            firstHalfHour: this.isFirstHalfHour()
        };
        this.columnClick.emit(workTimeData);
    }

    onMonthDateClick() {
        this.#calendarFacadeService.setSelectedDate(this.dayOfWeek()!, this.weekNumber()!);
    }

    getDate(): string {
        switch (this.calendarOption()) {
            case CalendarOptions.Day:
                return this.#calendarDateService.getDayDate();
            case CalendarOptions.WorkWeek:
            case CalendarOptions.Week:
                return this.#calendarDateService.getWeekDate(this.dayOfWeek()!);
            case CalendarOptions.Month: {
                return this.#calendarDateService.getMonthDate(this.dayOfWeek()!, this.weekNumber()!);
            }
        }
        return "";
    }

    isColumnChecked(): boolean {
        switch (this.calendarOption()) {
            case CalendarOptions.Day:
                return this.#calendarDateService.isHourCheckedDay(this.hour(), this.isFirstHalfHour());
            case CalendarOptions.WorkWeek:
            case CalendarOptions.Week:
                return this.#calendarDateService.isHourCheckedWeek(this.dayOfWeek()!, this.hour(), this.isFirstHalfHour());
            case CalendarOptions.Month:
                return this.#calendarDateService.isHourCheckedMonth(this.dayOfWeek()!, this.weekNumber()!);
            default: return false;
        }
    }

    isWorkDay(): boolean {
        const workHour = this.workHours()!.find(workHour => workHour.day === this.dayOfWeek() && workHour.id === this.hour());
        return workHour !== undefined && workHour.isWorkHour;
    }

    isWorkHour(): boolean {
        return this.workHours()!.find(workHour => workHour.day === this.dayOfWeek() && workHour.id === this.hour())!.isWorkHour;
    }

    isPastDate(): boolean {
        return this.#calendarDateService.isPastDate(this.dayOfWeek()!, this.weekNumber()!);
    }

    isSelectedDate(): boolean {
        return this.#calendarDateService.isDateInMonthSelected(this.dayOfWeek()!, this.weekNumber()!);
    }

    isCurrentDate(): boolean {
        return this.#calendarDateService.isDateInMonthCurrentDate(this.dayOfWeek()!, this.weekNumber()!);
    }

    getWorkTimeDuration(): string {
        return this.#calendarDateService.getWorkTimeDuration(this.dayOfWeek()!, this.weekNumber()!);
    }

    getCellClasses(): void {
        if(this.calendarOption() != CalendarOptions.Month) {
            this.workTime = this.#calendarDateService.getWorkTime(this.dayOfWeek()!, this.hour());
        } else {
            this.workTime = this.#calendarDateService.getWorkTimeMonth(this.dayOfWeek()!, this.weekNumber()!);
        }
        this.columnClasses = [];
        const isWork = this.calendarOption() === CalendarOptions.WorkWeek ? this.isWorkHour() : this.isWorkDay();

        if (isWork && !this.isColumnChecked()) {
            this.columnClasses.push('bg-white');
        } else if (!isWork && !this.isColumnChecked()) {
            this.columnClasses.push('bg-gray-100');
        }


        const backgroundClass = this.getWorkTimeBackgroundClass();
        if (!backgroundClass) return;
        this.columnClasses.push(backgroundClass);
    }

    getWorkTimeBackgroundClass(): string {
        switch (this.workTime?.workTimeType) {
            case WorkTimeType.Regular:
                return '!bg-blue-500';
            case WorkTimeType.Overtime:
                return '!bg-yellow-500';
            case WorkTimeType.Sick:
                return '!bg-gray-400';
            case WorkTimeType.Absent:
                return '!bg-red-500';
            case WorkTimeType.Vacation:
                return '!bg-green-500';
            default:
                return '';
        }
    }

    protected readonly CalendarOptions = CalendarOptions;
}
