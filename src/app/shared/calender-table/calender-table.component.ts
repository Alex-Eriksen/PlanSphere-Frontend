import { AfterViewInit, Component, ElementRef, inject, input, OnInit, output, ViewChild } from "@angular/core";
import { CalendarOptions } from "../enums/calendar-options.enum";
import { IWorkSchedule } from "../../core/features/workSchedules/models/work-schedule.model";
import { DayOfWeek } from "../enums/day-of-week.enum";
import { NgClass } from "@angular/common";
import { FormArray, FormControl } from "@angular/forms";
import { IWorkHour } from "../interfaces/work-hour.interface";
import { SmallHeaderComponent } from "../small-header/small-header.component";
import { ButtonComponent } from "../button/button.component";
import { DayInfo } from "../interfaces/day-info.interface";
import { CalendarDateService } from "../../core/services/calendar-date.service";
import { TranslateModule } from "@ngx-translate/core";
import { IWorkScheduleShift } from "../../core/features/workSchedules/models/work-schedule-shift.model";

@Component({
  selector: 'ps-calender-table',
  standalone: true,
    imports: [
        NgClass,
        SmallHeaderComponent,
        ButtonComponent,
        TranslateModule
    ],
  templateUrl: './calender-table.component.html',
  styleUrl: './calender-table.component.scss'
})
export class CalenderTableComponent implements OnInit, AfterViewInit{
    @ViewChild('workHoursTable') workHoursTable!: ElementRef;
    #calendarDateService = inject(CalendarDateService);

    calendarOption = input.required<FormControl<CalendarOptions>>();
    currentDate = input.required<FormControl<Date>>();
    selectedDate = input.required<FormControl<Date>>();
    workSchedule = input.required<FormControl<IWorkSchedule>>();
    workHours = input.required<FormControl<IWorkHour[]>>();
    selectedWeek = input.required<FormControl<number | null>>();
    selectedMonth = input.required<FormControl<number | null>>();
    hasIncremented = input.required<FormControl<boolean>>();
    setCurrentDate = input.required<FormControl<any>>();
    daysInMonth = input.required<FormArray<FormControl<DayInfo>>>();
    currentSelectedDay = input.required<FormControl<DayInfo>>();

    onNextClick = output<void>();
    onPreviousClick = output<void>();
    onCalendarOptionChange = output<CalendarOptions>();
    onCurrentDateClick = output<void>();

    weeksInMonth: number[] = []

    hours: number[] = Array.from({ length: 24 }, (_, i) => i);

    ngOnInit() {
        this.selectedMonth().valueChanges.subscribe(() => {
            if (this.calendarOption().value === CalendarOptions.Month) {
                this.weeksInMonth = Array(this.daysInMonth().length / 7).fill(0);
                return;
            }
            this.#scrollToFirstWorkHour();
        })

        this.calendarOption().valueChanges.subscribe((value: CalendarOptions) => {
            if(value === CalendarOptions.Month) return;
            this.#scrollToFirstWorkHour();
        })

    }

    ngAfterViewInit() {
        this.#scrollToCurrentWorkHour();
    }

    setSelectedDate(dayName: string, weekNumber: number): void {
        const date = this.daysInMonth().value.find(x => x.name === dayName && x.weekNumber === weekNumber)!;
        this.currentSelectedDay().patchValue(date);
    }


    getHeaderDate(): string {
        switch (this.calendarOption().value) {
            case CalendarOptions.Day:
                return this.#calendarDateService.formatDayHeader();
            case CalendarOptions.WorkWeek:
                return this.#calendarDateService.formatWorkWeekHeader(this.workSchedule().value);
            case CalendarOptions.Week:
                return this.#calendarDateService.formatWeekHeader();
            case CalendarOptions.Month:
                return this.#calendarDateService.formatMonthHeader();
        }
    }

    getDate(day?: string, weekNumber?: number): string {
        switch (this.calendarOption().value) {
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

    isPastDate(dayName: string, weekNumber: number): boolean {
        return this.#calendarDateService.isPastDate(dayName, weekNumber);
    }

    isWorkDay(dayName: string, hour: number): boolean {
        const workHour = this.workHours().value.find(workHour => workHour.day === dayName && workHour.id === hour);
        return workHour !== undefined && workHour.isWorkHour;
    }

    isSelectedDate(dayName: string, weekNumber: number): boolean {
        return this.#calendarDateService.isDateInMonthSelected(dayName, weekNumber);
    }

    isCurrentDate(dayName: string, weekNumber: number): boolean {
        return this.#calendarDateService.isDateInMonthCurrentDate(dayName, weekNumber);
    }

    isWorkHour(workScheduleShift: IWorkScheduleShift, hour: number): boolean {
        return this.workHours().value.find(workHour => workHour.day === workScheduleShift.day && workHour.id === hour)!.isWorkHour;
    }

    #scrollToFirstWorkHour(): void {
        const workHour = this.workHours().value.find(hour => hour.isWorkHour)!.id - 1;
        const tableElement = this.workHoursTable.nativeElement as HTMLElement;
        const rows = tableElement.querySelectorAll('tr');

        const currentHourRow = Array.from(rows).find(row => row.textContent?.trim() === String(workHour)) as HTMLElement;

        if (currentHourRow) {
            currentHourRow.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    #scrollToCurrentWorkHour(): void {
        const currentHour = new Date().getHours();
        const tableElement = this.workHoursTable.nativeElement as HTMLElement;
        const rows = tableElement.querySelectorAll('tr');

        const currentHourRow = Array.from(rows).find(row => row.textContent?.trim() === String(currentHour - 1)) as HTMLElement;

        if (currentHourRow) {
            currentHourRow.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    protected readonly DayOfWeek = DayOfWeek;
    protected readonly Object = Object;
    protected readonly CalendarOptions = CalendarOptions;
    protected readonly length = length;
}
