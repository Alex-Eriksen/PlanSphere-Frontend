import { Component, inject, input } from "@angular/core";
import { NgClass, NgIf } from "@angular/common";
import { DayInfoMonth } from "../enums/day-info-month.enum";
import { DayInfo } from "../interfaces/day-info.interface";
import { FormControl } from "@angular/forms";
import { CalendarOptions } from "../enums/calendar-options.enum";
import { CalendarDateService } from "../../core/services/calendar-date.service";
import { CalendarFacadeService } from "../../core/services/calendar.facade.service";

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
    #calendarFacadeService = inject(CalendarFacadeService);

    day = input.required<DayInfo>();
    currentSelectedDay = input.required<DayInfo>();
    calendarOption = input.required<CalendarOptions>();
    selectedWeek = input.required<number | null>();

    hoveredWeek  = input.required<FormControl<number | null>>();

    setSelectedDate(): void {
        this.#calendarFacadeService.selectDate(this.day());
    }

    isCurrentDate(): boolean {
        return this.#calendarDateService.isDateCurrentDate(this.day());
    }

    isSelectedDate(): boolean {
        return this.#calendarDateService.isSelectedDate(this.day());
    }

    isFirstInWeek(): boolean {
        return this.#calendarDateService.isFirstInWeek(this.day());
    }

    isLastInWeek(): boolean {
        return this.#calendarDateService.isLastInWeek(this.day());
    }

    isRowSelected(): boolean {
        return this.day().weekNumber === this.selectedWeek();
    }

    isHovered(): boolean {
        return this.day().weekNumber === this.hoveredWeek().value && this.day().weekNumber !== this.selectedWeek();
    }

    isRowSelectedAndHovered(): boolean {
        return this.day().weekNumber === this.hoveredWeek().value && this.day().weekNumber === this.selectedWeek()
    }

    onHoverStart(): void {
        if(this.hoveredWeek().value === this.day().weekNumber) return;
        this.hoveredWeek().patchValue(this.day().weekNumber)
    }

    onHoverEnd(): void {
        this.hoveredWeek().patchValue(null);
    }

    protected readonly DayInfoMonth = DayInfoMonth;
    protected readonly CalendarOptions = CalendarOptions;
}
