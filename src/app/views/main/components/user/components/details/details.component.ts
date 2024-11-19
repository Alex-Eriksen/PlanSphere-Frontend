import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { IRightsListener } from "../../../../../../core/interfaces/rights-data.interface";
import { ISourceLevelRights } from "../../../../../../core/features/authentication/models/source-level-rights.model";
import { AddressInputComponent } from "../../../../../../shared/address-input/address-input.component";
import { InputComponent } from "../../../../../../shared/input/input.component";
import { LineComponent } from "../../../../../../shared/line/line.component";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import { AuthenticationService } from "../../../../../../core/features/authentication/services/authentication.service";
import { UserService } from "../../../../../../core/features/users/services/user.service";
import { ToastService } from "../../../../../../core/services/error-toast.service";
import { updateNestedControlsPathAndValue } from "../../../../../../shared/utilities/form.utilities";
import { SettingsComponent } from "../settings/settings.component";
import { SelectFieldComponent } from "../../../../../../shared/select-field/select-field.component";
import { TranslateModule } from "@ngx-translate/core";
import { RoleService } from "../../../../../../core/features/roles/services/role.service";
import { IDropdownOption } from "../../../../../../shared/interfaces/dropdown-option.interface";
import { userFormGroupBuilder } from "../../../../../../core/features/users/utilities/user.utilities";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Duration } from "luxon";
import { WorkTimeType } from "../../../../../../core/features/workTimes/models/work-time-type.interface";
import { Period } from "../../../../../../core/features/workTimes/models/period.enum";
import { WorkTimeService } from "../../../../../../core/features/workTimes/services/work-time.service";
import { ButtonComponent } from "../../../../../../shared/button/button.component";
import { generateTranslatedDropdownOptionsFromEnum } from "../../../../../../shared/utilities/dropdown-option.utilities";
import { WorkTimeTypeTranslationMapper } from "../../../../../../core/mappers/work-time-type-translation.mapper";
import { PeriodTranslationMapper } from "../../../../../../core/mappers/period-translation.mapper";

@Component({
    selector: "ps-details",
    standalone: true,
    imports: [
        SmallHeaderComponent,
        AddressInputComponent,
        InputComponent,
        LineComponent,
        LoadingOverlayComponent,
        ReactiveFormsModule,
        SettingsComponent,
        SelectFieldComponent,
        TranslateModule,
        ButtonComponent
    ],
    templateUrl: "./details.component.html",
    styleUrl: "./details.component.scss"
})
export class DetailsComponent implements OnInit, IRightsListener {
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #authenticationService = inject(AuthenticationService);
    readonly #workTimeService = inject(WorkTimeService);
    readonly #destroyRef = inject(DestroyRef);
    readonly #toastService = inject(ToastService);
    readonly #userService = inject(UserService);
    readonly #roleService = inject(RoleService);
    readonly #userId = this.#authenticationService.getUserId();
    formGroup = userFormGroupBuilder(this.#fb);
    isPageLoading: boolean = false;
    roles: IDropdownOption[] = [];

    workTimeType = new FormControl<WorkTimeType>(WorkTimeType.Regular);
    period = new FormControl<Period>(Period.Day);

    workTimeTypes = generateTranslatedDropdownOptionsFromEnum(WorkTimeType, WorkTimeTypeTranslationMapper);
    periods = generateTranslatedDropdownOptionsFromEnum(Period, PeriodTranslationMapper);

    hours: string = "0";

    ngOnInit() {
        this.isPageLoading = true;
        this.#loadRoles();
        this.fetchWorkTimePeriod();
        if (this.#userId === undefined) {
            return;
        }


        this.getUserById(this.#userId);
        this.workTimeType.valueChanges.subscribe(() => this.fetchWorkTimePeriod())
        this.period.valueChanges.subscribe(() => this.fetchWorkTimePeriod())
    }

    fetchWorkTimePeriod() {
        this.#workTimeService.getWorkTimeWithinPeriod(this.workTimeType.value!, this.period.value!)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((data: string) => {
                const duration = Duration.fromISO(data);

                const totalHours = Math.floor(duration.as('hours'));
                const minutes = Math.round(duration.as('minutes')) % 60;

                this.hours = `${totalHours}:${minutes}m`;
                this.isPageLoading = false;
            });
    }

    setRightsData(rights: ISourceLevelRights): void {
        if (!rights.hasAdministratorRights) {
            this.formGroup.controls.roleIds.disable();
        }
    }

    getUserById(userId: number): void {
        this.#userService.getUserDetails(userId).subscribe({
            next: (user) => this.formGroup.patchValue(user),
            error: (error) => this.#toastService.showToast('USER.FIELD_TO_FETCH', error),
            complete: () => this.isPageLoading = false
        });
    }

    #loadRoles(): void {
        this.#roleService.lookUpRoles().subscribe({
            next: (roles) => this.roles = roles,
            error: (error) => console.error("Failed to fetch roles: ", error)
        });
    }

    patchDetails(): void {
        const paths = updateNestedControlsPathAndValue(this.formGroup);
        if (Object.keys(paths).length) {
            this.#userService.patchUser(paths, this.#userId).subscribe();
        }
    }

    protected readonly Period = Period;
    protected readonly Object = Object;
}
