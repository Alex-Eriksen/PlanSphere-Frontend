import { Component, DestroyRef, inject, OnInit, viewChild } from "@angular/core";
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { WorkScheduleComponent } from "../../../../../../shared/work-schedule/work-schedule.component";
import { NonNullableFormBuilder } from "@angular/forms";
import { constructWorkScheduleFormGroup } from "../../../../../../core/features/workSchedules/utilities/work-schedule.utilities";
import { IWorkSchedule } from "../../../../../../core/features/workSchedules/models/work-schedule.model";
import { WorkScheduleService } from "../../../../../../core/features/workSchedules/services/work-schedule.service";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import { AuthenticationService } from "../../../../../../core/features/authentication/services/authentication.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { OrganisationService } from "../../../../../../core/features/organisations/services/organisation.service";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";

@Component({
  selector: 'ps-settings',
  standalone: true,
    imports: [
        SmallHeaderComponent,
        WorkScheduleComponent,
        LoadingOverlayComponent
    ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
    readonly #authService = inject(AuthenticationService);
    readonly #organisationService = inject(OrganisationService)
    readonly #fb = inject(NonNullableFormBuilder);
    workScheduleFormGroup = constructWorkScheduleFormGroup(this.#fb);
    readonly #workScheduleService = inject(WorkScheduleService);
    readonly #destroyRef = inject(DestroyRef);
    isPageLoading = false;
    isUpdatingWorkSchedule = false;

    #organisationId!: number;
    workScheduleComponent = viewChild<WorkScheduleComponent>("workSchedule");

    ngOnInit() {
        this.isPageLoading = true;
        this.#authService.LoggedInUserObservable
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((loggedInUser) => {
                if (!loggedInUser) return;
                this.#organisationId = loggedInUser.organisationId;
                this.#getOrganisationSettings();
            });

    }

    #getOrganisationSettings() {
        this.#organisationService.getOrganisationDetailsById(this.#organisationId).subscribe((data) => {
            this.workScheduleFormGroup = constructWorkScheduleFormGroup(this.#fb, data.settings.defaultWorkSchedule, false);
            this.workScheduleComponent()?.updateSelectedDays(data.settings.defaultWorkSchedule.workScheduleShifts);
            this.isPageLoading = false;
        });
    }

    protected updateWorkSchedule(workSchedule: IWorkSchedule) {
        console.log(workSchedule);
        this.isUpdatingWorkSchedule = true;
        this.#workScheduleService
            .updateWorkSchedule(
                SourceLevel.Organisation,
                this.#organisationId,
                workSchedule,
                workSchedule.id
            )
            .subscribe(() => {
                this.isUpdatingWorkSchedule = false;
            });
    }
}
