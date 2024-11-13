import { Component, inject, input, OnInit, viewChild } from "@angular/core";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { ToggleInputComponent } from "../../../../../../shared/toggle-input/toggle-input.component";
import { TranslateModule } from "@ngx-translate/core";
import { WorkScheduleComponent } from "../../../../../../shared/work-schedule/work-schedule.component";
import { NonNullableFormBuilder } from "@angular/forms";
import { WorkScheduleService } from "../../../../../../core/features/workSchedules/services/work-schedule.service";
import { constructWorkScheduleFormGroup, recursivelyFindParentWorkSchedule } from "../../../../../../core/features/workSchedules/utilities/work-schedule.utilities";
import { IWorkSchedule } from "../../../../../../core/features/workSchedules/models/work-schedule.model";
import { updateNestedControlsPathAndValue } from "../../../../../../shared/utilities/form.utilities";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import { SourceLevelTranslationMapper } from "../../../../../../core/mappers/source-level-translation.mapper";
import { DepartmentService } from "../../../../../../core/features/department/services/department.service";
import { IDepartment } from "../../../../../../core/features/department/models/department.model";

@Component({
  selector: 'ps-settings',
  standalone: true,
    imports: [
        LoadingOverlayComponent,
        SmallHeaderComponent,
        ToggleInputComponent,
        TranslateModule,
        WorkScheduleComponent
    ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
    departmentId = input.required<number>();
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #workScheduleService = inject(WorkScheduleService);
    readonly #departmentService = inject(DepartmentService);
    isPageLoading = false;
    isUpdatingWorkSchedule = false;
    workScheduleFormGroup = constructWorkScheduleFormGroup(this.#fb);
    #workSchedule!: IWorkSchedule;
    formGroup = this.#fb.group({
        inheritDefaultWorkSchedule: this.#fb.control(false)
    });
    protected readonly SourceLevel = SourceLevel;
    protected readonly SourceLevelTranslationMapper = SourceLevelTranslationMapper;
    protected readonly workScheduleComponent = viewChild<WorkScheduleComponent>("workSchedule");

    ngOnInit() {
        this.isPageLoading = true;
        this.#getDepartmentById();
    }

    protected updateWorkSchedule(workSchedule: IWorkSchedule) {
        this.isUpdatingWorkSchedule = true;
        this.#workScheduleService.updateWorkSchedule(SourceLevel.Department, this.departmentId(), workSchedule, workSchedule.id).subscribe(() => {
            this.isUpdatingWorkSchedule = false;
        });
    }

    protected onInheritToggled(value: boolean) {
        if (value) {
            this.isPageLoading = true;
            this.#departmentService.patchDepartment(this.departmentId(), updateNestedControlsPathAndValue(this.formGroup))
                .subscribe(() => this.#getDepartmentById());
            return;
        }
        this.#departmentService.patchDepartment(this.departmentId(), updateNestedControlsPathAndValue(this.formGroup)).subscribe();
        this.workScheduleFormGroup = constructWorkScheduleFormGroup(this.#fb, this.#workSchedule);
        this.workScheduleComponent()?.updateSelectedDays(this.#workSchedule.workScheduleShifts);
    }

    #getDepartmentById(){
        this.#departmentService.getDepartmentById(this.departmentId(), SourceLevel.Department, this.departmentId())
            .subscribe((department: IDepartment) => {
            this.#workSchedule = department.settings.defaultWorkSchedule;
            this.workScheduleFormGroup = constructWorkScheduleFormGroup(this.#fb, recursivelyFindParentWorkSchedule(department.settings.defaultWorkSchedule), department.settings.inheritDefaultWorkSchedule);
            this.formGroup.controls.inheritDefaultWorkSchedule.patchValue(department.settings.inheritDefaultWorkSchedule);
            this.isPageLoading = false;
        });
    }
}
