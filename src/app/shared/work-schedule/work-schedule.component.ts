import { Component, input, output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { LoadingOverlayComponent } from "../loading-overlay/loading-overlay.component";
import { JsonPipe } from "@angular/common";
import { castControlFromAbstractToFormArray, castControlFromAbstractToFormGroup } from "../utilities/form.utilities";
import { WorkScheduleShiftComponent } from "./components/work-schedule-shift/work-schedule-shift.component";

@Component({
  selector: 'ps-work-schedule',
  standalone: true,
    imports: [
        LoadingOverlayComponent,
        JsonPipe,
        WorkScheduleShiftComponent
    ],
  templateUrl: './work-schedule.component.html',
  styleUrl: './work-schedule.component.scss'
})
export class WorkScheduleComponent {
    formGroup = input.required<FormGroup>();
    isLoading = input(false);
    valuesChanged = output();
    protected readonly castControlFromAbstractToFormArray = castControlFromAbstractToFormArray;
    protected readonly castControlFromAbstractToFormGroup = castControlFromAbstractToFormGroup;
}
