import { Component, inject, input, OnInit, viewChild } from "@angular/core";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { WorkScheduleComponent } from "../../../../../../shared/work-schedule/work-schedule.component";
import { constructWorkScheduleFormGroup, recursivelyFindParentWorkSchedule } from "../../../../../../core/features/workSchedules/utilities/work-schedule.utilities";
import { NonNullableFormBuilder } from "@angular/forms";
import { IWorkSchedule } from "../../../../../../core/features/workSchedules/models/work-schedule.model";
import { WorkScheduleService } from "../../../../../../core/features/workSchedules/services/work-schedule.service";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import { CompanyService } from "../../../../../../core/features/companies/services/company.service";
import { ICompany } from "../../../../../../core/features/companies/models/company.model";
import { ToggleInputComponent } from "../../../../../../shared/toggle-input/toggle-input.component";
import { SourceLevelTranslationMapper } from "../../../../../../core/mappers/source-level-translation.mapper";
import { TranslateModule } from "@ngx-translate/core";
import { updateNestedControlsPathAndValue } from "../../../../../../shared/utilities/form.utilities";

@Component({
  selector: 'ps-settings',
  standalone: true,
    imports: [
        LoadingOverlayComponent,
        SmallHeaderComponent,
        WorkScheduleComponent,
        ToggleInputComponent,
        TranslateModule
    ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
    companyId = input.required<number>();
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #workScheduleService = inject(WorkScheduleService);
    readonly #companyService = inject(CompanyService);
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
        this.#getCompanyById();
    }

    protected updateWorkSchedule(workSchedule: IWorkSchedule) {
        this.isUpdatingWorkSchedule = true;
        this.#workScheduleService.updateWorkSchedule(SourceLevel.Company, this.companyId(), workSchedule, workSchedule.id).subscribe(() => {
            this.isUpdatingWorkSchedule = false;
        });
    }

    protected onInheritToggled(value: boolean) {
        if (value) {
            this.isPageLoading = true;
            this.#companyService.patch(this.companyId(), updateNestedControlsPathAndValue(this.formGroup))
                .subscribe(() => this.#getCompanyById());
            return;
        }
        this.#companyService.patch(this.companyId(), updateNestedControlsPathAndValue(this.formGroup)).subscribe();
        this.workScheduleFormGroup = constructWorkScheduleFormGroup(this.#fb, this.#workSchedule);
        this.workScheduleComponent()?.updateSelectedDays(this.#workSchedule.workScheduleShifts);
    }

    #getCompanyById(){
        this.#companyService.companyById(this.companyId(), this.companyId()).subscribe((company: ICompany) => {
            this.#workSchedule = company.settings.defaultWorkSchedule;
            this.workScheduleFormGroup = constructWorkScheduleFormGroup(this.#fb, recursivelyFindParentWorkSchedule(company.settings.defaultWorkSchedule), company.settings.inheritDefaultWorkSchedule);
            this.formGroup.controls.inheritDefaultWorkSchedule.patchValue(company.settings.inheritDefaultWorkSchedule);
            this.isPageLoading = false;
        });
    }
}
