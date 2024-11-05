import { IBaseLookUp } from "../interfaces/look-up.interface";
import { IDropdownOption } from "../interfaces/dropdown-option.interface";

export const generateDropdownOptionsFromLookUps = <T = number> (lookUps: IBaseLookUp<T>[]): IDropdownOption[] => {
    return lookUps.map((lookUp) => {
        return {
            label: lookUp.value,
            value: lookUp.id,
        };
    });
};
