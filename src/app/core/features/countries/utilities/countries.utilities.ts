import { ICountryLookup } from "../models/country-lookup.model";
import { IDropdownOption } from "../../../../shared/interfaces/dropdown-option.interface";

export const  mapLookupItemsToDropdownOptions = (type: ICountryLookup[]): IDropdownOption[] => {
    return type.map((item) => ({
        label: item.name,
        value: item.id
    }));
}

