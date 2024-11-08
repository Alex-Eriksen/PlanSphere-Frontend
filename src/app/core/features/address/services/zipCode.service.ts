import { inject, Injectable } from "@angular/core";
import { ZipCodeRepository } from "../repositories/zipCode.repository";
import { map, Observable } from "rxjs";
import { IDropdownOption } from "../../../../shared/interfaces/dropdown-option.interface";
import { mapZipCodesToDropdownOptions } from "../utilities/address.utilities";

@Injectable({
  providedIn: 'root'
})
export class ZipCodeService {
    readonly #zipcodeRepository = inject(ZipCodeRepository);

    getZipCodeLookups() : Observable<IDropdownOption[]> {
        return this.#zipcodeRepository.getZipCodeLookups().pipe(
            map((option) => {
                return mapZipCodesToDropdownOptions(option);
            }),
        );
    }
}
