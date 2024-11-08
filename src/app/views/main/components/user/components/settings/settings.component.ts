import { Component, DestroyRef, inject, OnDestroy, OnInit, viewChild } from "@angular/core";
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import { ToggleInputComponent } from "../../../../../../shared/toggle-input/toggle-input.component";
import { markControlAsTouchedAndDirty, updateNestedControlsPathAndValue } from "../../../../../../shared/utilities/form.utilities";
import { UserService } from "../../../../../../core/features/users/services/user.service";
import { IUser } from "../../../../../../core/features/users/models/user.model";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";
import { TooltipComponent } from "../../../../../../shared/tooltip/tooltip.component";
import { MatTooltip } from "@angular/material/tooltip";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { WorkScheduleComponent } from "../../../../../../shared/work-schedule/work-schedule.component";
import { SelectFieldComponent } from "../../../../../../shared/select-field/select-field.component";
import { WorkScheduleService } from "../../../../../../core/features/workSchedules/services/work-schedule.service";
import { forkJoin, Observable, Subscription, tap } from "rxjs";
import { IDropdownOption } from "../../../../../../shared/interfaces/dropdown-option.interface";
import { constructWorkScheduleFormGroup, recursivelyFindParentWorkSchedule } from "../../../../../../core/features/workSchedules/utilities/work-schedule.utilities";
import { TranslateModule } from "@ngx-translate/core";
import { JsonPipe } from "@angular/common";
import { IWorkSchedule } from "../../../../../../core/features/workSchedules/models/work-schedule.model";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import { ToastService } from "../../../../../../core/services/error-toast.service";

@Component({
  selector: 'ps-settings',
  standalone: true,
    imports: [
        SmallHeaderComponent,
        ToggleInputComponent,
        ReactiveFormsModule,
        LoadingOverlayComponent,
        TooltipComponent,
        MatTooltip,
        WorkScheduleComponent,
        SelectFieldComponent,
        TranslateModule,
        JsonPipe
    ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit, OnDestroy {
    readonly #userService = inject(UserService);
    readonly #workScheduleService = inject(WorkScheduleService);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #destroyRef = inject(DestroyRef);
    readonly #toastService = inject(ToastService);

    isLoading = false;
    loadingWorkSchedule = false;
    workScheduleOptions: IDropdownOption[] = [];
    userDetails!: IUser;

    workScheduleFormGroup = constructWorkScheduleFormGroup(this.#fb);
    formGroup = this.#fb.group({
        settings: this.#fb.group({
            inheritWorkSchedule: this.#fb.control(false),
            inheritedWorkScheduleId: this.#fb.control<number | null>(null, {updateOn: "change"}),
            autoCheckInOut: this.#fb.control(false),
            autoCheckOutDisabled: this.#fb.control(false),
            isEmailPrivate: this.#fb.control(false),
            isAddressPrivate: this.#fb.control(false),
            isPhoneNumberPrivate: this.#fb.control(false),
            isBirthdayPrivate: this.#fb.control(false),
        })
    }, { updateOn: "blur" });

    userSettingsSubscription!: Subscription;
    isUpdatingWorkSchedule: boolean = false;
    workScheduleComponent = viewChild<WorkScheduleComponent>("workScheduleComponent");

    ngOnInit() {
        this.isLoading = true;
        this.userSettingsSubscription = forkJoin([
            this.#getUserDetails(),
            this.#lookUpWorkSchedules()
        ]).subscribe(() => this.isLoading = false);

        this.formGroup.controls.settings.controls.autoCheckInOut.valueChanges
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((value) => this.#updateAutoCheckOutDisabled(value));

        this.formGroup.controls.settings.controls.inheritWorkSchedule.valueChanges
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((value) => this.#onInheritedToggled(value));
    }

    ngOnDestroy() {
        this.userSettingsSubscription.unsubscribe();
    }

    patchSettings() {
        const paths = updateNestedControlsPathAndValue(this.formGroup);
        if (Object.keys(paths).length) {
            this.#userService.patchUser(paths).subscribe();
        }
    }

    #lookUpWorkSchedules(): Observable<IDropdownOption[]> {
        return this.#workScheduleService.lookUpWorkSchedules().pipe(tap((options) => this.workScheduleOptions = options));
    }

    #getUserDetails(): Observable<IUser> {
        return this.#userService.getUserDetails().pipe(tap((user) => {
            this.userDetails = user;
            this.workScheduleFormGroup = constructWorkScheduleFormGroup(this.#fb, recursivelyFindParentWorkSchedule(user.settings.workSchedule));
            this.formGroup.patchValue(user);
            this.formGroup.controls.settings.controls.inheritedWorkScheduleId.patchValue(user.settings.workSchedule.parent?.id);
            this.#updateAutoCheckOutDisabled(user.settings.autoCheckInOut);
        }));
    }

    #updateAutoCheckOutDisabled(value: boolean): void {
        if (!value) {
            this.formGroup.controls.settings.controls.autoCheckOutDisabled.disable();
            this.formGroup.controls.settings.controls.autoCheckOutDisabled.patchValue(false);
            markControlAsTouchedAndDirty(this.formGroup.controls.settings.controls.autoCheckOutDisabled);
        } else {
            this.formGroup.controls.settings.controls.autoCheckOutDisabled.enable();
        }
    }

    protected onInheritedWorkScheduleChanged(workScheduleId: number) {
        this.patchSettings();
        this.#updateWorkSchedule(workScheduleId);
    }

    #onInheritedToggled(value: boolean){
        if (value) {
            this.workScheduleFormGroup = constructWorkScheduleFormGroup(this.#fb, undefined, true);
            return;
        }
        this.workScheduleFormGroup.enable();
        this.formGroup.controls.settings.controls.inheritedWorkScheduleId.patchValue(null);
        this.workScheduleFormGroup = constructWorkScheduleFormGroup(this.#fb, this.userDetails.settings.workSchedule);
        this.workScheduleComponent()?.updateSelectedDays(this.userDetails.settings.workSchedule.workScheduleShifts);
    }

    #updateWorkSchedule(workScheduleId: number) {
        this.loadingWorkSchedule = true;
        this.formGroup.controls.settings.controls.inheritWorkSchedule.enable();
        this.#workScheduleService.getWorkScheduleById(workScheduleId).subscribe((workSchedule) => {
            this.workScheduleFormGroup = constructWorkScheduleFormGroup(this.#fb, recursivelyFindParentWorkSchedule(workSchedule), true);
            this.loadingWorkSchedule = false;
        });
    }

    onUpdateWorkSchedule(workSchedule: IWorkSchedule) {
        this.isUpdatingWorkSchedule = true;
        this.#workScheduleService.updateWorkSchedule(SourceLevel.Organisation, 0, workSchedule).subscribe({
            next: () => {
                this.isUpdatingWorkSchedule = false;
            },
            error: err => {
                this.#toastService.showToast(err.error.Message);
                this.isUpdatingWorkSchedule = false;
            }
        });
    }
}
