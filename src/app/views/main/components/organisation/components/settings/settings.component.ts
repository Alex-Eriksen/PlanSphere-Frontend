import { Component, DestroyRef, inject, OnDestroy, OnInit, signal, viewChild } from "@angular/core";
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
import { ButtonComponent } from "../../../../../../shared/button/button.component";
import { UserService } from "../../../../../../core/features/users/services/user.service";
import { IDropdownOption } from "../../../../../../shared/interfaces/dropdown-option.interface";
import { generateDropdownOptionsFromLookUps } from "../../../../../../shared/utilities/dropdown-option.utilities";
import { forkJoin, Subscription, tap } from "rxjs";
import { SelectFieldComponent } from "../../../../../../shared/select-field/select-field.component";
import { DialogService } from "../../../../../../core/services/dialog.service";

@Component({
  selector: 'ps-settings',
  standalone: true,
    imports: [
        SmallHeaderComponent,
        WorkScheduleComponent,
        LoadingOverlayComponent,
        ButtonComponent,
        SelectFieldComponent
    ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit, OnDestroy {
    readonly #authService = inject(AuthenticationService);
    readonly #organisationService = inject(OrganisationService);
    readonly #userService = inject(UserService);
    readonly #dialogService = inject(DialogService);
    readonly #fb = inject(NonNullableFormBuilder);
    workScheduleFormGroup = constructWorkScheduleFormGroup(this.#fb);
    readonly #workScheduleService = inject(WorkScheduleService);
    readonly #destroyRef = inject(DestroyRef);
    loadSubscription!: Subscription;
    isPageLoading = false;
    isUpdatingWorkSchedule = false;
    userOptions!: IDropdownOption[];
    selectedUserControl = this.#fb.control(0, {updateOn: "change"});
    isChangingOwnership = signal(false);

    #organisationId!: number;
    isOrganisationOwner = false;
    workScheduleComponent = viewChild<WorkScheduleComponent>("workSchedule");

    ngOnInit() {
        this.isPageLoading = true;
        this.#authService.LoggedInUserObservable
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((loggedInUser) => {
                if (!loggedInUser) return;
                this.#organisationId = loggedInUser.organisationId;
                this.isOrganisationOwner = loggedInUser.ownedOrganisations.includes(this.#organisationId);
                if (this.isOrganisationOwner) {
                    this.selectedUserControl.patchValue(loggedInUser.userId);
                }
                this.loadSubscription = forkJoin([
                    this.#getOrganisationSettings(),
                    this.#lookUpUsers()
                ]).subscribe(() => this.isPageLoading = false);
            });
    }

    ngOnDestroy() {
        this.loadSubscription.unsubscribe();
    }

    #getOrganisationSettings() {
        return this.#organisationService.getOrganisationDetailsById(this.#organisationId).pipe(tap((data) => {
            this.workScheduleFormGroup = constructWorkScheduleFormGroup(this.#fb, data.settings.defaultWorkSchedule);
            this.workScheduleComponent()?.updateSelectedDays(data.settings.defaultWorkSchedule.workScheduleShifts);
        }));
    }

    #lookUpUsers() {
        return this.#userService.lookUpUsers().pipe(tap((users) => this.userOptions = generateDropdownOptionsFromLookUps(users)));
    }

    protected updateWorkSchedule(workSchedule: IWorkSchedule) {
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

    openConfirmOwnerChangeDialog() {
        this.#dialogService.open(
            {
                title: "ORGANISATION.SET_NEW_OWNER",
                tooltipLabel: "ORGANISATION.SET_NEW_OWNER_TOOLTIP",
                callBack: () => this.#changeOwner(),
                submitLabel: "CONFIRM",
                isInputIncluded: false,
                descriptions: ["ORGANISATION.CHANGE_OWNER_CONFIRMATION"],
                isSubmitLoading: this.isChangingOwnership,
                cancelLabel: "CANCEL",
            },
            "confirmation"
        );
    }

    #changeOwner() {
        this.#organisationService.changeOrganisationOwner(this.selectedUserControl.value).subscribe(() => {
            this.isChangingOwnership.set(false);
            this.#dialogService.close();
        });
    }
}
