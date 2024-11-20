import { ButtonComponent } from "../../../../../../shared/button/button.component";
import { SelectFieldComponent } from "../../../../../../shared/select-field/select-field.component";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Component, OnInit, input, inject, OnDestroy } from "@angular/core";
import { InputComponent } from "../../../../../../shared/input/input.component";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";
import { LineComponent } from "../../../../../../shared/line/line.component";
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { IDepartment } from "../../../../../../core/features/department/models/department.model";
import { DepartmentService } from "../../../../../../core/features/department/services/department.service";
import { ToastService } from "../../../../../../core/services/error-toast.service";
import { IDropdownOption } from "../../../../../../shared/interfaces/dropdown-option.interface";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import {
    markAllControlsAsTouchedAndDirty,
    updateNestedControlsPathAndValue
} from "../../../../../../shared/utilities/form.utilities";
import { CountryService } from "../../../../../../core/features/address/services/country.service";
import { IRightsListener } from "../../../../../../core/interfaces/rights-data.interface";
import { ISourceLevelRights } from "../../../../../../core/features/authentication/models/source-level-rights.model";
import { forkJoin, Subscription, tap } from "rxjs";
import { recursivelyFindParentAddress } from "../../../../../../core/features/address/utilities/address.utilities";
import { ToggleInputComponent } from "../../../../../../shared/toggle-input/toggle-input.component";
import { AddressInputComponent } from "../../../../../../shared/address-input/address-input.component";


@Component({
    imports: [
        InputComponent,
        ButtonComponent,
        SelectFieldComponent,
        LoadingOverlayComponent,
        ReactiveFormsModule,
        LineComponent,
        SmallHeaderComponent,
        AddressInputComponent,
        ToggleInputComponent
    ],
    selector: "ps-details",
    standalone: true,
    styleUrl: "./details.component.scss",
    templateUrl: "./details.component.html"
})
export class DetailsComponent implements OnInit, OnDestroy, IRightsListener {
    departmentId = input.required<number>()
    department!: IDepartment
    readonly #departmentService = inject(DepartmentService);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #countryService = inject(CountryService);
    readonly #toastService = inject(ToastService);
    countries: IDropdownOption[] = []
    sourceLevel = SourceLevel.Department
    departmentDetailsSubscription!: Subscription;
    isPageLoading: boolean = false;

    ngOnInit(): void {
        this.isPageLoading = true;
        if (this.departmentId) {
            this.#loadCountries();
            this.departmentDetailsSubscription = forkJoin([
                this.loadDepartmentDetails(this.sourceLevel,this.departmentId())
        ]).subscribe({
                next: () => {
                    this.formGroup.patchValue(this.department);
                    this.formGroup.controls.address.patchValue(recursivelyFindParentAddress(this.department.address));
                    this.isPageLoading = false;
                    this.onInheritedToggled(this.department.inheritAddress!);
                },
                error: () => {
                    if (this.departmentId == null){
                        this.#toastService.showToast('DEPARTMENT.DO_NOT_EXIST')
                    }
                },
                complete: () => {
                    this.isPageLoading = false;
                }
            });
        }

    }

    ngOnDestroy() {
        this.departmentDetailsSubscription.unsubscribe();
    }

    formGroup = this.#fb.group({
        name: this.#fb.control("", Validators.required),
        description: this.#fb.control("", Validators.required),
        building: this.#fb.control("", Validators.required),
        inheritAddress: this.#fb.control(false),
        address: this.#fb.group({
            streetName: this.#fb.control(""),
            houseNumber: this.#fb.control(""),
            door: this.#fb.control(""),
            floor: this.#fb.control(""),
            postalCode: this.#fb.control(""),
            countryId: this.#fb.control(""),
        }),
        updateOn: "blur"
    })

    #loadCountries(): void {
        this.#countryService.getCountryLookups().subscribe({
            next: (data) => {
                this.countries = data;
            }
        })
    }

    patchDetails(): void {
        if (!this.formGroup.valid)
        {
            markAllControlsAsTouchedAndDirty(this.formGroup);
            return;
        }
        const paths = updateNestedControlsPathAndValue(this.formGroup);
        if(Object.keys(paths).length) {
            this.#departmentService.patchDepartment(this.departmentId(), paths).subscribe()
        }
    }

    onInheritedToggled(value: boolean): void {
            const paths = updateNestedControlsPathAndValue(this.formGroup);
            if(Object.keys(paths).length) {
                this.#departmentService.patchDepartment(this.departmentId(), paths).subscribe(() => {
                    this.loadDepartmentDetails(this.sourceLevel ,this.departmentId()).subscribe();
                });
            }
            if (value)
            {
                this.formGroup.controls.address.disable();

            }
            else
            {
                this.formGroup.controls.address.enable();
                this.formGroup.controls.address.patchValue(this.department.address);
            }
    }

    loadDepartmentDetails(sourceLevel: SourceLevel, departmentId: number) {
        return this.#departmentService.getDepartmentById(departmentId, sourceLevel, departmentId).pipe(tap(data => {
            this.department = data;
            this.formGroup.controls.address.patchValue(recursivelyFindParentAddress(data.address));
        }));
    }

    setRightsData(rights: ISourceLevelRights) {
        if (!rights.hasEditRights && !rights.hasAdministratorRights) {
            this.formGroup.disable();
        }
    }

    protected readonly input = input;
}
