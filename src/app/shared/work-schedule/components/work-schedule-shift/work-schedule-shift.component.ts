import { Component, input, output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { JsonPipe, LowerCasePipe } from "@angular/common";
import { SelectFieldComponent } from "../../../select-field/select-field.component";
import { TranslateModule } from "@ngx-translate/core";
import { castControlFromAbstractToFormControl } from "../../../utilities/form.utilities";
import { generateHourAndMinuteDropdownOptions, generateTranslatedDropdownOptionsFromEnum } from "../../../utilities/dropdown-option.utilities";
import { ShiftLocation } from "../../../../core/enums/shift-location.enum";
import { ShiftLocationTranslationMapper } from "../../../../core/mappers/shift-location-translation.mapper";
import { DayOfWeekTranslationMapper } from "../../../../core/mappers/day-of-week-translation.mapper";

@Component({
  selector: 'ps-work-schedule-shift',
  standalone: true,
    imports: [
        JsonPipe,
        SelectFieldComponent,
        TranslateModule,
        LowerCasePipe
    ],
  templateUrl: './work-schedule-shift.component.html',
  styleUrl: './work-schedule-shift.component.scss'
})
export class WorkScheduleShiftComponent {
    valuesChanged = output();
    timeOptions = generateHourAndMinuteDropdownOptions();
    locationOptions = generateTranslatedDropdownOptionsFromEnum(ShiftLocation, ShiftLocationTranslationMapper);
    formGroup = input.required<FormGroup>();
    protected readonly castControlFromAbstractToFormControl = castControlFromAbstractToFormControl;
    protected readonly DayOfWeekTranslationMapper = DayOfWeekTranslationMapper;
}
