import { Component, inject, input, OnInit } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { LineComponent } from "../../line/line.component";
import { SmallHeaderComponent } from "../../small-header/small-header.component";
import { InputComponent } from "../../input/input.component";
import { castControlFromAbstractToFormControl } from "../../utilities/form.utilities";
import { SelectFieldComponent } from "../../select-field/select-field.component";
import { IDropdownOption } from "../../interfaces/dropdown-option.interface";
import { CountryService } from "../../../core/features/address/services/country.service";
import { ZipCodeService } from "../../../core/features/address/services/zipCode.service";

@Component({
  selector: 'ps-address-input',
  standalone: true,
    imports: [
        InputComponent,
        LineComponent,
        SmallHeaderComponent,
        ReactiveFormsModule,
        SelectFieldComponent
    ],
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.scss'
})
export class AddressInputComponent implements OnInit {
    protected readonly castControlFromAbstractToFormControl = castControlFromAbstractToFormControl;
    readonly #countryService = inject(CountryService);
    readonly #zipCodeService = inject(ZipCodeService);
    addressFormGroup = input.required<FormGroup>();
    countries: IDropdownOption[] = []
    zipCodes: IDropdownOption[] = []
    floors: IDropdownOption[] = [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
        { value: "9", label: "9" },
        { value: "10", label: "10" },
    ];

    ngOnInit() {
        this.#loadCountries();
        this.#loadZipCodes();
    }

    #loadCountries(): void {
        this.#countryService.getCountryLookups().subscribe({
            next: (data) => {
                this.countries = data;
            },
            error: (error) => console.error("Failed to fetch countries: ", error)
        });
    }

    #loadZipCodes(): void {
        this.#zipCodeService.getZipCodeLookups().subscribe({
            next: (data) => {
                console.log(data);
                this.zipCodes = data;
            },
            error: (error) => console.error("Failed to fetch zip codes: ", error)
        });
    }
}
