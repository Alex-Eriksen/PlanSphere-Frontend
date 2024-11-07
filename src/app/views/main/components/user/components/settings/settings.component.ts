import { Component, DestroyRef, inject, input, OnDestroy, OnInit } from "@angular/core";
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
        SelectFieldComponent
    ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit, OnDestroy {
    readonly #userService = inject(UserService);
    readonly #workScheduleService = inject(WorkScheduleService);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #destroyRef = inject(DestroyRef);

    isLoading = false;
    workScheduleOptions: IDropdownOption[] = [];

    formGroup = this.#fb.group({
        settings: this.#fb.group({
            inheritWorkSchedule: this.#fb.control(false),
            inheritedWorkScheduleId: this.#fb.control(0, {updateOn: "change"}),
            workSchedule: this.#fb.group({
                parent: this.#fb.group({}),
            }),
            autoCheckInOut: this.#fb.control(false),
            autoCheckOutDisabled: this.#fb.control(false),
            isEmailPrivate: this.#fb.control(false),
            isAddressPrivate: this.#fb.control(false),
            isPhoneNumberPrivate: this.#fb.control(false),
            isBirthdayPrivate: this.#fb.control(false),
        })
    }, { updateOn: "blur" });

    userSettingsSubscription!: Subscription;

    ngOnInit() {
        this.isLoading = true;
        this.userSettingsSubscription = forkJoin([
            this.#getUserDetails(),
            this.#lookUpWorkSchedules()
        ]).subscribe(() => this.isLoading = false);

        this.formGroup.controls.settings.controls.autoCheckInOut.valueChanges
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((value) => {
                this.#updateAutoCheckOutDisabled(value);
            });
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
            this.formGroup.patchValue(user);
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
}
