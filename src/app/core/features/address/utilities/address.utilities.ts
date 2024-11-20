import { IDropdownOption } from "../../../../shared/interfaces/dropdown-option.interface";
import { IZipCodeLookup } from "../models/zip-code-lookup.model";
import { FormGroup, NonNullableFormBuilder } from "@angular/forms";
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

export const constructAddressFormGroup = (fb: NonNullableFormBuilder, address?: IAddress, disabled?: boolean): FormGroup => {
    const fg = fb.group({
        id: fb.control({ value: address?.id ?? 0, disabled: true }),
        streetName: fb.control<string | null>({ value: address?.streetName ?? null, disabled: false }),
        houseNumber: fb.control<string | null>({ value: address?.houseNumber ?? null, disabled: false }),
        door: fb.control<string | null>({ value: address?.door  ?? null, disabled: false }),
        floor: fb.control<string | null>({ value: address?.floor  ?? null, disabled: false }),
        postalCode: fb.control<string | null>({ value: address?.postalCode  ?? null, disabled: false }),
        countryId: fb.control<string | null>({ value: address?.countryId  ?? null, disabled: false }),
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
