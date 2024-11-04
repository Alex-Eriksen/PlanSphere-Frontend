import { Component, inject, input,  OnInit } from "@angular/core";
import { CompanyService } from "../../../../../../core/features/company/services/company.service";
import { ICompany } from "../../../../../../core/features/company/models/company.model";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputComponent } from "../../../../../../shared/input/input.component";
import { ButtonComponent } from "../../../../../../shared/button/button.component";
import { SelectFieldComponent } from "../../../../../../shared/select-field/select-field.component";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";
import { CountryService } from "../../../../../../core/features/countries/services/country.service";
import { IDropdownOption } from "../../../../../../shared/interfaces/dropdown-option.interface";
import { updateNestedControlsPathAndValue } from "../../../../../../shared/utilities/form.utilities";
import { ToastService } from "../../../../../../core/services/error-toast.service";

@Component({
  selector: 'ps-details',
  standalone: true,
    imports: [
        InputComponent,
        ButtonComponent,
        SelectFieldComponent,
        LoadingOverlayComponent,
        ReactiveFormsModule
    ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
    companyId = input.required<number>()
    company?: ICompany
    readonly #companyService = inject(CompanyService);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #country = inject(CountryService);
    readonly #toastService = inject(ToastService);
    countries: IDropdownOption[] = []
    isPageLoading: boolean = false;

    ngOnInit(): void {
        this.isPageLoading = true;
        if (this.companyId) {
            this.loadCountries();
            this.loadCompanyDetails(this.companyId());
        }
        if (this.companyId == null){
            console.log("No companyId");
            this.#toastService.showToast("This Company Doesnt exist")
        }
    }

    formGroup = this.#fb.group({
        name: this.#fb.control("", Validators.required),
        cvr: this.#fb.control("", Validators.required),
        contactName: this.#fb.control(""),
        contactEmail: this.#fb.control(""),
        contactPhoneNumber: this.#fb.control(""),
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

    loadCountries(): void {
        this.#country.getCountryLookups().subscribe({
            next: (data) => {
                this.countries = data;
            }
        })
    }

    patchDetails(): void {
        const paths = updateNestedControlsPathAndValue(this.formGroup);
        console.log(paths);
        if(Object.keys(paths).length) {
            this.#companyService.patch(this.companyId(), paths).subscribe()
        }

    }

    loadCompanyDetails(id: number): void {
        this.#companyService.companyById(id).subscribe({
            next: (data: ICompany) => this.formGroup.patchValue(data),
            error: () => this.#toastService.showToast("This Company doenst exist!"),

            complete: () => this.isPageLoading = false
        });
    }

    deleteCompany(id: number): void {
        this.#companyService.delete(id)
    }

}
