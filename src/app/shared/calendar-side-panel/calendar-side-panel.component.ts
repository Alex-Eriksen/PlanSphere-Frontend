import { Component, inject, input } from "@angular/core";
import { ButtonComponent } from "../button/button.component";
import { NgClass, NgIf, NgOptimizedImage } from "@angular/common";
import { CalendarMonths } from "../enums/calender-months.enum";
import { CalendarOptions } from "../enums/calendar-options.enum";
import { FormControl } from "@angular/forms";
import { DayInfo } from "../interfaces/day-info.interface";
import { LoadingOverlayComponent } from "../loading-overlay/loading-overlay.component";
import { CalendarSidePanelItemComponent } from "../calendar-side-panel-item/calendar-side-panel-item.component";
import { TranslateModule } from "@ngx-translate/core";
import { CalendarFacadeService } from "../../core/services/calendar.facade.service";

@Component({
  selector: 'ps-calendar-side-panel',
  standalone: true,
    imports: [
        ButtonComponent,
        NgIf,
        NgClass,
        LoadingOverlayComponent,
        CalendarSidePanelItemComponent,
        NgOptimizedImage,
        TranslateModule
    ],
  templateUrl: './calendar-side-panel.component.html',
  styleUrl: './calendar-side-panel.component.scss'
})
export class CalendarSidePanelComponent {
    #calendarFacadeService = inject(CalendarFacadeService);
    calendarOption = input.required<CalendarOptions>();
    currentDate = input.required<Date>();
    selectedDate = input.required<Date>();
    selectedWeek = input.required<number | null>();
    selectedMonth = input.required<number>();
    daysInMonth = input.required<DayInfo[]>();
    currentSelectedDay = input.required<DayInfo>();

    hoveredWeek = new FormControl<number | null>(0);

    incrementMonth = () => this.#calendarFacadeService.changeMonth(true);

    decrementMonth = () => this.#calendarFacadeService.changeMonth(false);

    protected readonly CalendarMonths = CalendarMonths;
    protected readonly Object = Object;
}
