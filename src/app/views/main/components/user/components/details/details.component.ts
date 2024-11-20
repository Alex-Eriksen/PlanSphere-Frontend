import { Component, DestroyRef, inject, OnDestroy, OnInit } from "@angular/core";
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { IRightsListener } from "../../../../../../core/interfaces/rights-data.interface";
import { ISourceLevelRights } from "../../../../../../core/features/authentication/models/source-level-rights.model";
import { AddressInputComponent } from "../../../../../../shared/address-input/address-input.component";
import { InputComponent } from "../../../../../../shared/input/input.component";
import { LineComponent } from "../../../../../../shared/line/line.component";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";
import { NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import { AuthenticationService } from "../../../../../../core/features/authentication/services/authentication.service";
import { UserService } from "../../../../../../core/features/users/services/user.service";
import { ToastService } from "../../../../../../core/services/error-toast.service";
import { updateNestedControlsPathAndValue } from "../../../../../../shared/utilities/form.utilities";
import { SettingsComponent } from "../settings/settings.component";
import { SelectFieldComponent } from "../../../../../../shared/select-field/select-field.component";
import { TranslateModule } from "@ngx-translate/core";
import { RoleService } from "../../../../../../core/features/roles/services/role.service";
import { IDropdownOption } from "../../../../../../shared/interfaces/dropdown-option.interface";
import {
    userFormGroupBuilder,
    workTimeFormGroupBuilder
} from "../../../../../../core/features/users/utilities/user.utilities";
import { forkJoin, Observable, Subscription, tap } from "rxjs";
import { JobTitleService } from "../../../../../../core/features/jobTitle/services/job-title.service";
import { IUser } from "../../../../../../core/features/users/models/user.model";
import { WorkTimeType } from "../../../../../../core/features/workTimes/models/work-time-type.interface";
import { Period } from "../../../../../../core/features/workTimes/models/period.enum";
import { WorkTimeService } from "../../../../../../core/features/workTimes/services/work-time.service";
import { ButtonComponent } from "../../../../../../shared/button/button.component";
import { generateTranslatedDropdownOptionsFromEnum } from "../../../../../../shared/utilities/dropdown-option.utilities";
import { WorkTimeTypeTranslationMapper } from "../../../../../../core/mappers/work-time-type-translation.mapper";
import { PeriodTranslationMapper } from "../../../../../../core/mappers/period-translation.mapper";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Duration } from "luxon";

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
export class DetailsComponent implements OnInit, OnDestroy, IRightsListener {
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #authenticationService = inject(AuthenticationService);
    readonly #workTimeService = inject(WorkTimeService);
    readonly #destroyRef = inject(DestroyRef);
    readonly #toastService = inject(ToastService);
    readonly #userService = inject(UserService);
    readonly #roleService = inject(RoleService);
    readonly #jobTitleService = inject(JobTitleService);
    #userId = 0;
    formGroup = userFormGroupBuilder(this.#fb);
    isPageLoading: boolean = false;
    roles: IDropdownOption[] = [];
    jobTitleOptions: IDropdownOption[] = [];
    #forkJoin!: Observable<readonly unknown[]>;
    #loadSubscription!: Subscription;

    workTimeFormGroup = workTimeFormGroupBuilder(this.#fb);

    workTimeTypes = generateTranslatedDropdownOptionsFromEnum(WorkTimeType, WorkTimeTypeTranslationMapper);
    periods = generateTranslatedDropdownOptionsFromEnum(Period, PeriodTranslationMapper);

    hours: string = "0";

    ngOnInit() {
        this.isPageLoading = true;
        this.#forkJoin = forkJoin([
            this.#loadRoles(),
            this.#lookUpJobTitles(),
            this.getUserById(),
            this.fetchWorkTimePeriod()
        ]);
        this.#authenticationService.LoggedInUserObservable
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((data) => {
                if (data === null) return;
                this.#userId = data.userId;
                this.#loadSubscription = this.#forkJoin.subscribe({
                    next: () => this.isPageLoading = false
                });
            });

        this.workTimeFormGroup.valueChanges
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                this.fetchWorkTimePeriod().subscribe();
        })
    }

    ngOnDestroy() {
        this.#loadSubscription.unsubscribe();
    }

    fetchWorkTimePeriod(): Observable<string> {
        return this.#workTimeService.getWorkTimeWithinPeriod(this.workTimeFormGroup.controls.workTimeType.value!, this.workTimeFormGroup.controls.period.value!)
            .pipe(tap((data: string) => {
                const duration = Duration.fromISO(data);
                const totalHours = Math.floor(duration.as("hours"));
                const minutes = Math.round(duration.as("minutes")) % 60;
                this.hours = `${totalHours}:${minutes}m`;
            }));
    }

    setRightsData(rights: ISourceLevelRights): void {
        if (!rights.hasAdministratorRights) {
            this.formGroup.controls.roleIds.disable();
        }

        if (!rights.hasSetOwnJobTitleRights && !rights.hasAdministratorRights) {
            this.formGroup.controls.jobTitleIds.disable();
        }
    }

    getUserById(): Observable<IUser> {
        return this.#userService.getUserDetails(this.#userId).pipe(tap({
            next: (user) => this.formGroup.patchValue(user),
            error: (error) => this.#toastService.showToast('USER.FIELD_TO_FETCH', error)
        }));
    }

    #loadRoles(): Observable<IDropdownOption[]> {
        return this.#roleService.lookUpRoles().pipe(tap({
            next: (roles) => this.roles = roles
        }));
    }

    #lookUpJobTitles(): Observable<IDropdownOption[]> {
        return this.#jobTitleService.jobTitleLookUp().pipe(tap({
            next: (jobTitles) => this.jobTitleOptions = jobTitles
        }));
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
