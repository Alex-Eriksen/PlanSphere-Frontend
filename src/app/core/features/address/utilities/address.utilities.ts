import { IDropdownOption } from "../../../../shared/interfaces/dropdown-option.interface";
import { IZipCodeLookup } from "../models/zip-code-lookup.model";

export const mapZipCodesToDropdownOptions = (lookUps: IZipCodeLookup[]): IDropdownOption[] => {
    return lookUps.map((lookUp) => {
        return {
            label: lookUp.id,
            value: lookUp.id,
            subLabel: lookUp.value,
        };
    });
};
