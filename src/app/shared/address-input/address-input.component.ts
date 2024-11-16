import { Component, inject, input, OnInit } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { LineComponent } from "../line/line.component";
import { SmallHeaderComponent } from "../small-header/small-header.component";
import { InputComponent } from "../input/input.component";
import { castControlFromAbstractToFormControl } from "../utilities/form.utilities";
import { SelectFieldComponent } from "../select-field/select-field.component";
import { IDropdownOption } from "../interfaces/dropdown-option.interface";
import { CountryService } from "../../core/features/address/services/country.service";
import { ZipCodeService } from "../../core/features/address/services/zipCode.service";
import { generateNumberRangeDropdownOptions } from "../utilities/dropdown-option.utilities";

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
    floorNumber: number = 10;
    countries: IDropdownOption[] = []
    zipCodes: IDropdownOption[] = []
    floors: IDropdownOption[] = generateNumberRangeDropdownOptions(this.floorNumber);

    ngOnInit() {
        this.#loadCountries();
        this.#loadZipCodes();

        const floorControl = this.addressFormGroup().get("floor");
        if (floorControl) {
            floorControl.valueChanges.subscribe((floorValue: number) => {
                this.updateFloorsDropdown(floorValue);
            });
        }
    }

    #loadCountries(): void {
        this.#countryService.getCountryLookups().subscribe({
            next: (data) => this.countries = data,
            error: (error) => console.error("Failed to fetch countries: ", error)
        });
    }

    #loadZipCodes(): void {
        this.#zipCodeService.getZipCodeLookups().subscribe({
            next: (data) => this.zipCodes = data,
            error: (error) => console.error("Failed to fetch zip codes: ", error)
        });
    }

    private updateFloorsDropdown(floorNumber?: number): void {
        const maxFloors = floorNumber || 10;
        this.floors = generateNumberRangeDropdownOptions(maxFloors);
    }
}
