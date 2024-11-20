import { Component, inject, input, OnDestroy, OnInit } from "@angular/core";
import { CompanyService } from "../../../../../../core/features/company/services/company.service";
import { ICompany } from "../../../../../../core/features/company/models/company.model";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputComponent } from "../../../../../../shared/input/input.component";
import { ButtonComponent } from "../../../../../../shared/button/button.component";
import { SelectFieldComponent } from "../../../../../../shared/select-field/select-field.component";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";
import { CountryService } from "../../../../../../core/features/address/services/country.service";
import { IDropdownOption } from "../../../../../../shared/interfaces/dropdown-option.interface";
import { markAllControlsAsTouchedAndDirty, updateNestedControlsPathAndValue } from "../../../../../../shared/utilities/form.utilities";
import { ToastService } from "../../../../../../core/services/error-toast.service";
import { LineComponent } from "../../../../../../shared/line/line.component";
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { IRightsListener } from "../../../../../../core/interfaces/rights-data.interface";
import { ISourceLevelRights } from "../../../../../../core/features/authentication/models/source-level-rights.model";
import { constructAddressFormGroup, recursivelyFindParentAddress } from "../../../../../../core/features/address/utilities/address.utilities";
import { ToggleInputComponent } from "../../../../../../shared/toggle-input/toggle-input.component";
import { forkJoin, Subscription, tap } from "rxjs";
import { AddressInputComponent } from "../../../../../../shared/address-input/address-input.component";

@Component({
  selector: 'ps-details',
  standalone: true,
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
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, OnDestroy, IRightsListener {
    companyId = input.required<number>()
    company!: ICompany
    readonly #companyService = inject(CompanyService);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #countryService = inject(CountryService);
    readonly #toastService = inject(ToastService);
    countries: IDropdownOption[] = []
    isPageLoading: boolean = false;
    companyDetailsSubscription!: Subscription;
    protected readonly input = input;

    ngOnInit(): void {
        this.isPageLoading = true;

        if (this.companyId) {
            this.#loadCountries();
            this.companyDetailsSubscription = forkJoin([
                this.loadCompanyDetails(this.companyId())
            ]).subscribe({
                next: () => {
                    this.formGroup.patchValue(this.company);
                    this.formGroup.controls.address.patchValue(recursivelyFindParentAddress(this.company.address));
                    this.onInheritedToggled(this.company.inheritAddress!);
                },
                error: (err) => {
                        console.log(err);
                        this.#toastService.showToast('COMPANY.DO_NOT_EXIST');
                },
                complete: () => {
                    this.isPageLoading = false;
                }
            });
        }

    }

    ngOnDestroy() {
        this.companyDetailsSubscription.unsubscribe();
    }

    addressFormGroup = constructAddressFormGroup(this.#fb);
    formGroup = this.#fb.group({
        name: this.#fb.control("", Validators.required),
        cvr: this.#fb.control("", Validators.required),
        contactName: this.#fb.control(""),
        contactEmail: this.#fb.control("", Validators.email),
        contactPhoneNumber: this.#fb.control("", [Validators.pattern(/^[0-9]*$/), Validators.minLength(8), Validators.maxLength(8)]),
        inheritAddress:this.#fb.control(false),
        address: this.#fb.group({
            streetName: this.#fb.control(""),
            houseNumber: this.#fb.control(""),
            door: this.#fb.control(""),
            floor: this.#fb.control(""),
            postalCode: this.#fb.control(""),
            countryId: this.#fb.control(""),
        }),
        careOf: this.#fb.control(""),
    },{
        updateOn: "blur"
    });

    setRightsData(rights: ISourceLevelRights) {
        if (!rights.hasEditRights && !rights.hasAdministratorRights) {
            this.formGroup.disable();
        }
    }

    #loadCountries(): void {
        this.#countryService.getCountryLookups().subscribe({
            next: (data) => {
                this.countries = data;
            }
        })
    }

    onInheritedToggled(value: boolean): void {
        if(value)
        {
            const paths = updateNestedControlsPathAndValue(this.formGroup);
            if(Object.keys(paths).length) {
                this.#companyService.patch(this.companyId(), paths).subscribe(() => {
                    this.loadCompanyDetails(this.companyId()).subscribe();
                });
            }
            this.formGroup.controls.address.disable();
        }
        else
        {
            this.formGroup.controls.address.enable();
            this.formGroup.controls.address.patchValue(this.company.address);
        }
    }

    patchDetails(): void {
        if (!this.formGroup.valid)
        {
            markAllControlsAsTouchedAndDirty(this.formGroup);
            return;
        }
        const paths = updateNestedControlsPathAndValue(this.formGroup);
        if(Object.keys(paths).length) {
            this.#companyService.patch(this.companyId(), paths).subscribe()
        }

    }

    loadCompanyDetails(companyId: number) {
        return this.#companyService.companyById(companyId, companyId).pipe(tap(data => {
                this.company = data;
                this.formGroup.controls.address.patchValue(recursivelyFindParentAddress(data.address));
        }));
    }
}
