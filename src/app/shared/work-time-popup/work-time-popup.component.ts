import { Component, inject } from "@angular/core";
import { ButtonDropdownComponent } from "../button-dropdown/button-dropdown.component";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NonNullableFormBuilder } from "@angular/forms";
import { IWorkTimePopupInputs } from "./work-time-popup-inputs.interface";
import { InputComponent } from "../input/input.component";
import { ButtonComponent } from "../button/button.component";
import { TranslateModule } from "@ngx-translate/core";
import { castControlFromAbstractToFormControl, markAllControlsAsTouchedAndDirty } from "../utilities/form.utilities";
import { WorkTimeService } from "../../core/features/workTimes/services/work-time.service";
import { IWorkTimeRequest } from "../../core/features/workTimes/models/work-time-request";
import { LineComponent } from "../line/line.component";
import { IDropdownOption } from "../interfaces/dropdown-option.interface";
import { constructWorkTimeFormGroup } from "../../views/main/components/frontpage/calendar.utilities";
import { SelectFieldComponent } from "../select-field/select-field.component";
import {
    generateHalfHourDropdownOptions,
    generateTranslatedDropdownOptionsFromEnum
} from "../utilities/dropdown-option.utilities";
import { WorkTimeType } from "../../core/features/workTimes/models/work-time-type.interface";
import { WorkTimeTypeTranslationMapper } from "../../core/mappers/work-time-type-translation.mapper";
import { ShiftLocationTranslationMapper } from "../../core/mappers/shift-location-translation.mapper";
import { ShiftLocation } from "../../core/enums/shift-location.enum";

@Component({
  selector: 'ps-work-time-popup',
  standalone: true,
    imports: [
        ButtonDropdownComponent,
        InputComponent,
        ButtonComponent,
        TranslateModule,
        LineComponent,
        SelectFieldComponent
    ],
  templateUrl: './work-time-popup.component.html',
  styleUrl: './work-time-popup.component.scss'
})
export class WorkTimePopupComponent {
    readonly #matDialogRef = inject(MatDialogRef<WorkTimePopupComponent>);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly componentInputs: IWorkTimePopupInputs = inject(MAT_DIALOG_DATA);
    readonly #workTimeService = inject(WorkTimeService);

    formGroup = constructWorkTimeFormGroup(this.#fb, this.componentInputs.currentWorkTime, this.componentInputs.startDate);

    halfHourOptions: IDropdownOption[] = generateHalfHourDropdownOptions(this.componentInputs.startDate);
    workTimeTypeOptions: IDropdownOption[] = generateTranslatedDropdownOptionsFromEnum(WorkTimeType, WorkTimeTypeTranslationMapper);
    locationOptions: IDropdownOption[] = generateTranslatedDropdownOptionsFromEnum(ShiftLocation, ShiftLocationTranslationMapper);

    isFormSubmitting: boolean = false;

    submitForm() {
        if (this.formGroup.invalid) {
            markAllControlsAsTouchedAndDirty(this.formGroup);
            return;
        }

        if(this.isStartOrEndTimeInvalid()) {
            return;
        }

        this.isFormSubmitting = true;
        this.componentInputs.isEditPopup ?
            this.#updateWorkTime() :
            this.#createWorkTime();
    }

    #createWorkTime() {
        this.#workTimeService.createWorkTime(this.#prepareRequest())
            .subscribe({
                complete: () => {
                    this.isFormSubmitting = false;
                    this.closeDialog(true);
                }
            })
    }

    #updateWorkTime() {
        this.#workTimeService.updateWorkTime(this.componentInputs.currentWorkTime!.id, this.#prepareRequest())
            .subscribe({
                complete: () => {
                    this.isFormSubmitting = false;
                    this.closeDialog(true);
                }
            })
    }

    deleteWorkTime() {
        if(!this.componentInputs.isEditPopup) this.closeDialog();
        this.#workTimeService.deleteWorkTime(this.componentInputs.currentWorkTime!.id)
           .subscribe({
                complete: () => {
                    this.closeDialog(true);
                }
            })
    }

    #prepareRequest(): IWorkTimeRequest {
        const newDate = new Date(this.formGroup.controls['startDateTime'].value);
        const endDate = new Date(this.formGroup.controls['endDateTime'].value);
        newDate.setDate(this.componentInputs.startDate.getDate());
        endDate.setDate(this.componentInputs.startDate.getDate());
        return {
            startDateTime: newDate.toISOString(),
            endDateTime: endDate.toISOString(),
            workTimeType: this.formGroup.value.workTimeType,
            location: this.formGroup.value.location,
        };
    }

    closeDialog(performedHttpAction?: boolean): void {
        this.#matDialogRef.close(performedHttpAction);
    }

    isStartOrEndTimeInvalid(): boolean {
        const newStartDate = new Date(this.formGroup.controls['startDateTime'].value);
        const newEndDate = new Date(this.formGroup.controls['endDateTime'].value);

        const filteredWorkTimes = this.componentInputs.workTimes.filter(
            workTime => workTime.id !== this.componentInputs.currentWorkTime?.id
        );

        return filteredWorkTimes.some(existingWorkTime => {
            const existingStart = existingWorkTime.startDateTime;
            const existingEnd = existingWorkTime.endDateTime!;

            return !(
                (newStartDate >= existingEnd || newEndDate <= existingStart) ||
                newStartDate.getTime() === existingEnd.getTime() ||
                newEndDate.getTime() === existingStart.getTime()
            );
        });
    }

    protected readonly castControlFromAbstractToFormControl = castControlFromAbstractToFormControl;
}
