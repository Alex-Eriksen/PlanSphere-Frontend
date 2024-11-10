import { Component, input } from "@angular/core";
import { ButtonComponent } from "../button/button.component";
import { NgClass, NgIf, NgOptimizedImage } from "@angular/common";
import { CalendarMonths } from "../enums/calender-months.enum";
import { CalendarOptions } from "../enums/calendar-options.enum";
import { FormArray, FormControl } from "@angular/forms";
import { DayInfo } from "../interfaces/day-info.interface";
import { LoadingOverlayComponent } from "../loading-overlay/loading-overlay.component";
import { CalendarSidePanelItemComponent } from "../calendar-side-panel-item/calendar-side-panel-item.component";

@Component({
  selector: 'ps-calendar-side-panel',
  standalone: true,
    imports: [
        ButtonComponent,
        NgIf,
        NgClass,
        LoadingOverlayComponent,
        CalendarSidePanelItemComponent,
        NgOptimizedImage
    ],
  templateUrl: './calendar-side-panel.component.html',
  styleUrl: './calendar-side-panel.component.scss'
})
export class CalendarSidePanelComponent {
    calendarOption = input.required<FormControl<CalendarOptions>>();
    currentDate = input.required<FormControl<Date>>();
    selectedDate = input.required<FormControl<Date>>();
    selectedWeek = input.required<FormControl<number | null>>();
    selectedMonth = input.required<FormControl<number>>();
    hasIncremented = input<FormControl<boolean>>();
    setCurrentDate = input.required<FormControl<any>>();
    daysInMonth = input.required<FormArray<FormControl<DayInfo>>>();
    currentSelectedDay = input.required<FormControl<DayInfo>>();

    hoveredWeek = new FormControl<number | null>(0);

    incrementMonth(): void {
        this.selectedMonth().patchValue(this.selectedMonth().value + 1);
    }

    decrementMonth(): void {
        this.selectedMonth().patchValue(this.selectedMonth().value - 1);
    }

    protected readonly CalendarMonths = CalendarMonths;
    protected readonly Object = Object;
}
