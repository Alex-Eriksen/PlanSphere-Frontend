import { IDropdownOption } from "../interfaces/dropdown-option.interface";
import { IBaseLookUp } from "../../core/abstract/models/base-look.model";

export const generateTranslatedDropdownOptionsFromEnum = (
    enumObject: any,
    enumMapper: Map<NonNullable<unknown>, string>,
): IDropdownOption[] => {
    const dropdownOptions: IDropdownOption[] = [];
    Object.keys(enumObject).forEach((key) => {
        const label = enumMapper.get(enumObject[key]);
        if (!label) throw new Error(`Provided enum value does not exist in the provided mapper: ${enumObject[key]}`);
        dropdownOptions.push({
            label,
            value: enumObject[key],
        });
    });
    return dropdownOptions;
};

export const generateDropdownOptionsFromLookUps = (lookUps: IBaseLookUp[]): IDropdownOption[] => {
    return lookUps.map((lookUp) => {
        return {
            label: lookUp.value,
            value: lookUp.id,
        };
    });
};
