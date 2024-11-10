import { Component, inject, OnInit } from "@angular/core";
import { ButtonComponent } from "../../../../shared/button/button.component";
import { LoadingOverlayComponent } from "../../../../shared/loading-overlay/loading-overlay.component";
import { NgClass, NgIf } from "@angular/common";
import {
    generateFormGroup,
} from "./calendar.utilities";
import { NonNullableFormBuilder } from "@angular/forms";
import { LineComponent } from "../../../../shared/line/line.component";
import { SubHeaderComponent } from "../../../../shared/sub-header/sub-header.component";
import { SmallHeaderComponent } from "../../../../shared/small-header/small-header.component";
import { TranslateModule } from "@ngx-translate/core";
import { CalenderTableComponent } from "../../../../shared/calender-table/calender-table.component";
import { CalendarSidePanelComponent } from "../../../../shared/calendar-side-panel/calendar-side-panel.component";
import { CalendarComponent } from "../../../../shared/calendar/calendar.component";

@Component({
  selector: 'ps-frontpage',
  standalone: true,
    imports: [
        ButtonComponent,
        LoadingOverlayComponent,
        NgClass,
        NgIf,
        LineComponent,
        SubHeaderComponent,
        SmallHeaderComponent,
        TranslateModule,
        CalenderTableComponent,
        CalendarSidePanelComponent,
        CalendarComponent
    ],
  templateUrl: './frontpage.component.html',
  styleUrl: './frontpage.component.scss'
})
export class FrontpageComponent implements OnInit {
    readonly #fb = inject(NonNullableFormBuilder);
    isPageLoading: boolean = false;
    formGroup: any;

    ngOnInit() {
        this.isPageLoading = true;
        if (this.isPageLoading) {
            this.formGroup = generateFormGroup(this.#fb);
            this.isPageLoading = false;
        }
    }
}
