import { IDropdownOption } from "../../../../shared/interfaces/dropdown-option.interface";
import { IZipCodeLookup } from "../models/zip-code-lookup.model";
import { FormBuilder, FormGroup } from "@angular/forms";

export const mapZipCodesToDropdownOptions = (lookUps: IZipCodeLookup[]): IDropdownOption[] => {
    return lookUps.map((lookUp) => {
        return {
            label: lookUp.id,
            value: lookUp.id,
            subLabel: lookUp.value,
        };
    });
};

export const addressFormBuilderControl = (fb: FormBuilder): FormGroup => {
    return fb.group({
        streetName: fb.control(""),
        houseNumber: fb.control(""),
        door: fb.control(""),
        floor: fb.control(""),
        postalCode: fb.control(""),
        countryId: fb.control(""),
    });
}
