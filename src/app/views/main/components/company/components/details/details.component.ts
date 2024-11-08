import { Component, inject, input, numberAttribute, OnInit } from "@angular/core";
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
        SmallHeaderComponent
    ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
    companyId = input.required<number>()
    company?: ICompany
    readonly #companyService = inject(CompanyService);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #countryService = inject(CountryService);
    readonly #toastService = inject(ToastService);
    countries: IDropdownOption[] = []
    isPageLoading: boolean = false;

    ngOnInit(): void {
        this.isPageLoading = true;
        if (this.companyId) {
            this.#loadCountries();
            this.loadCompanyDetails(this.companyId());
        }
        if (this.companyId == null){
            this.#toastService.showToast('COMPANY.DO_NOT_EXIST')
        }
    }

    formGroup = this.#fb.group({
        name: this.#fb.control("", Validators.required),
        cvr: this.#fb.control("", Validators.required),
        contactName: this.#fb.control(""),
        contactEmail: this.#fb.control("", Validators.email),
        contactPhoneNumber: this.#fb.control("", [Validators.pattern(/^[0-9]*$/), Validators.minLength(8), Validators.maxLength(8)]),
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
            this.#companyService.patch(this.companyId(), paths).subscribe()
        }

    }

    loadCompanyDetails(id: number): void {
        this.#companyService.companyById(id).subscribe({
            next: (value: ICompany) => this.formGroup.patchValue(value),
            error: () => this.#toastService.showToast('COMPANY.DO_NOT_EXIST'),
            complete: () => this.isPageLoading = false
        });
    }

    deleteCompany(id: number): void {
        this.#companyService.delete(id)
    }

    protected readonly Validators = Validators;
    protected readonly input = input;
    protected readonly numberAttribute = numberAttribute;
}
