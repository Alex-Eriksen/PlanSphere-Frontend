import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { IDropdownOption } from "../../../../shared/interfaces/dropdown-option.interface";
import { CountryRepository } from "../repositories/country.repository";
import { generateDropdownOptionsFromLookUps } from "../../../../shared/utilities/dropdown-option.utilities";

@Injectable({
    providedIn: "root",
})
export class CountryService {
    readonly #countryRepository = inject(CountryRepository);

    getCountryLookups() : Observable<IDropdownOption[]> {
        return this.#countryRepository.getCountryLookups().pipe(
            map((option) => {
            return generateDropdownOptionsFromLookUps(option);
        }),
    );
    }
}
