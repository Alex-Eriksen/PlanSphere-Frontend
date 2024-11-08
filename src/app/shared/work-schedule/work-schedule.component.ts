import { Component, DestroyRef, inject, input, OnInit, output } from "@angular/core";
import { FormGroup, NonNullableFormBuilder } from "@angular/forms";
import { LoadingOverlayComponent } from "../loading-overlay/loading-overlay.component";
import { JsonPipe } from "@angular/common";
import { castControlFromAbstractToFormArray, castControlFromAbstractToFormGroup } from "../utilities/form.utilities";
import { WorkScheduleShiftComponent } from "./components/work-schedule-shift/work-schedule-shift.component";
import { MatCheckbox, MatCheckboxChange } from "@angular/material/checkbox";
import { DayOfWeekTranslationMapper } from "../../core/mappers/day-of-week-translation.mapper";
import { DayOfWeek } from "../../core/enums/day-of-week.enum";
import { TranslateModule } from "@ngx-translate/core";
import { IWorkScheduleShift } from "../../core/features/workSchedules/models/work-schedule-shift.model";
import { constructWorkScheduleShiftFormGroup } from "../../core/features/workSchedules/utilities/work-schedule.utilities";
import { ShiftLocation } from "../../core/enums/shift-location.enum";
import { LineComponent } from "../line/line.component";
import { IWorkSchedule } from "../../core/features/workSchedules/models/work-schedule.model";
import { ButtonComponent } from "../button/button.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'ps-work-schedule',
  standalone: true,
    imports: [
        LoadingOverlayComponent,
        JsonPipe,
        WorkScheduleShiftComponent,
        MatCheckbox,
        TranslateModule,
        LineComponent,
        ButtonComponent
    ],
  templateUrl: './work-schedule.component.html',
  styleUrl: './work-schedule.component.scss'
})
export class WorkScheduleComponent implements OnInit {
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #destroyRef = inject(DestroyRef);
    formGroup = input.required<FormGroup>();
    canSave = input(false);
    isLoading = input(false);
    selectedDaysOfTheWeek: DayOfWeek[] = [];
    valuesChanged = output();
    updateWorkSchedule = output<IWorkSchedule>();
    isUpdating = input(false);
    protected readonly castControlFromAbstractToFormArray = castControlFromAbstractToFormArray;
    protected readonly castControlFromAbstractToFormGroup = castControlFromAbstractToFormGroup;
    protected readonly DayOfWeekTranslationMapper = DayOfWeekTranslationMapper;
    protected readonly DayOfWeek = DayOfWeek;
    protected readonly Object = Object;

    ngOnInit() {
        this.updateSelectedDays(castControlFromAbstractToFormArray(this.formGroup().controls['workScheduleShifts']).value);

        castControlFromAbstractToFormArray(this.formGroup().controls['workScheduleShifts']).valueChanges
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((value: IWorkScheduleShift[]) => this.updateSelectedDays(value));
    }

    protected castStringToDayOfWeek(day: string): DayOfWeek {
        return day as DayOfWeek;
    }

    protected selectedDayChanged(value: { event: MatCheckboxChange, day: DayOfWeek }): void {
        if (!value.event.checked) {
            const index = this.selectedDaysOfTheWeek.indexOf(value.day);
            const controlIndex = castControlFromAbstractToFormArray(this.formGroup().controls['workScheduleShifts']).value.indexOf((y: IWorkScheduleShift[]) => y.map(x => x.day === value.day));
            castControlFromAbstractToFormArray(this.formGroup().controls['workScheduleShifts']).removeAt(controlIndex);
            this.selectedDaysOfTheWeek.splice(index, 1);
        } else {
            this.selectedDaysOfTheWeek.push(value.day);
            castControlFromAbstractToFormArray(this.formGroup().controls['workScheduleShifts']).push(constructWorkScheduleShiftFormGroup(this.#fb, {
                day: value.day,
                startTime: '09:00:00',
                endTime: '17:00:00',
                id: -1,
                location: ShiftLocation.Office
            }));
        }
    }

    updateSelectedDays(value: IWorkScheduleShift[]) {
        this.selectedDaysOfTheWeek = [];
        value.forEach((workScheduleShift: IWorkScheduleShift) => {
            this.selectedDaysOfTheWeek.push(workScheduleShift.day);
        });
    }
}
