import { IDropdownOption } from "../../../../shared/interfaces/dropdown-option.interface";
import { IZipCodeLookup } from "../models/zip-code-lookup.model";
import { FormBuilder, FormGroup, NonNullableFormBuilder } from "@angular/forms";
import { IAddress } from "../models/address.model";

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

export const constructAddressFormGroup = (fb: NonNullableFormBuilder, address?: IAddress, disabled?: boolean): FormGroup => {
    const fg = fb.group({
        id: fb.control({ value: address?.id ?? 0, disabled: true }),
        streetName: fb.control(""),
        houseNumber: fb.control(""),
        door: fb.control(""),
        floor: fb.control(""),
        postalCode: fb.control(""),
        countryId: fb.control(""),

    });
    if(disabled) {
        fg.disable();
        return fg;
    }
    return fg;
};

export const recursivelyFindParentAddress = (address: IAddress): IAddress => {
    if(address.parent !== null) return recursivelyFindParentAddress(address.parent);
    return address;
}
