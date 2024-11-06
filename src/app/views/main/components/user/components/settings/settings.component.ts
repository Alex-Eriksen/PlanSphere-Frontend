import { Component, DestroyRef, inject, input, OnInit } from "@angular/core";
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
        WorkScheduleComponent
    ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
    readonly #userService = inject(UserService);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #destroyRef = inject(DestroyRef);

    isLoading = false;

    formGroup = this.#fb.group({
        settings: this.#fb.group({
            inheritWorkSchedule: this.#fb.control(false),
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

    ngOnInit() {
        this.isLoading = true;
        this.#userService.getUserDetails().subscribe((user) => {
            this.formGroup.patchValue(user);
            this.#updateAutoCheckOutDisabled(user.settings.autoCheckInOut);
            this.isLoading = false;
        });

        this.formGroup.controls.settings.controls.autoCheckInOut.valueChanges.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((value) => {
           this.#updateAutoCheckOutDisabled(value);
        });
    }

    patchSettings() {
        const paths = updateNestedControlsPathAndValue(this.formGroup);
        if (Object.keys(paths).length) {
            this.#userService.patchUser(paths).subscribe();
        }
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
