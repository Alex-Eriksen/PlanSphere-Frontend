import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { mapLookupItemsToDropdownOptions } from "../utilities/countries.utilities";
import { IDropdownOption } from "../../../../shared/interfaces/dropdown-option.interface";
import { CountryRepository } from "../repositories/country.repository";

@Injectable({
    providedIn: "root",
})
export class CountryService {
    readonly #countryRepository = inject(CountryRepository);

    getCountryLookups() : Observable<IDropdownOption[]> {
        return this.#countryRepository.getCountryLookups().pipe(
            map((option) => {
            return mapLookupItemsToDropdownOptions(option);
        }),
    );
    }
}
