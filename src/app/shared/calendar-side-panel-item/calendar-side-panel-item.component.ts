import { Component, inject, input } from "@angular/core";
import { NgClass, NgIf } from "@angular/common";
import { DayInfoMonth } from "../enums/day-info-month.enum";
import { DayInfo } from "../interfaces/day-info.interface";
import { FormArray, FormControl } from "@angular/forms";
import { CalendarOptions } from "../enums/calendar-options.enum";
import { CalendarDateService } from "../../core/services/calendar-date.service";

@Component({
  selector: 'ps-calendar-side-panel-item',
  standalone: true,
    imports: [
        NgIf,
        NgClass
    ],
  templateUrl: './calendar-side-panel-item.component.html',
  styleUrl: './calendar-side-panel-item.component.scss'
})
export class CalendarSidePanelItemComponent {
    #calendarDateService = inject(CalendarDateService);
    day = input.required<FormControl<DayInfo>>();
    daysInMonth = input.required<FormArray<FormControl<DayInfo>>>();
    currentSelectedDay = input.required<FormControl<DayInfo>>();
    currentDate = input.required<FormControl<Date>>();
    selectedDate = input.required<FormControl<Date>>();
    calendarOption = input.required<FormControl<CalendarOptions>>();
    selectedMonth = input.required<FormControl<number | null>>();
    selectedWeek = input.required<FormControl<number | null>>();
    hoveredWeek  = input.required<FormControl<number | null>>();

    setSelectedDate(): void {
        this.currentSelectedDay().patchValue(this.day().value);
        this.selectedWeek().patchValue(this.day().value.weekNumber);
    }

    isCurrentDate(): boolean {
        return this.#calendarDateService.isDateCurrentDate(this.day().value);
    }

    isSelectedDate(): boolean {
        return this.day().value === this.currentSelectedDay().value;
    }

    isFirstInWeek(): boolean {
        return this.#calendarDateService.isFirstInWeek(this.day().value);    }

    isLastInWeek(): boolean {
        return this.#calendarDateService.isLastInWeek(this.day().value);
    }

    isRowSelected(): boolean {
        return this.day().value.weekNumber === this.selectedWeek().value;
    }

    isHovered(): boolean {
        return this.day().value.weekNumber === this.hoveredWeek().value && this.day().value.weekNumber !== this.selectedWeek().value;
    }

    isRowSelectedAndHovered(): boolean {
        return this.day().value.weekNumber === this.hoveredWeek().value && this.day().value.weekNumber === this.selectedWeek().value
    }

    onHoverStart(): void {
        if(this.hoveredWeek().value === this.day().value.weekNumber) return;
        this.hoveredWeek().patchValue(this.day().value.weekNumber)
    }

    onHoverEnd(): void {
        this.hoveredWeek().patchValue(null);
    }

    protected readonly DayInfoMonth = DayInfoMonth;
    protected readonly CalendarOptions = CalendarOptions;
}
