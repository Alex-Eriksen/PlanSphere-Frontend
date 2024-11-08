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

export const addressFormBuilderControle = (formBuilder: FormBuilder): FormGroup => {
    return formBuilder.group({
        streetName: (""),
        houseNumber: (""),
        door: (""),
        floor: (""),
        postalCode: (""),
        countryId: (""),
    });

}
