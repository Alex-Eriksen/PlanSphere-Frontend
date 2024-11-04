import { IBaseLookUp } from "../interfaces/look-up.interface";
import { IDropdownOption } from "../interfaces/dropdown-option.interface";

export const generateDropdownOptionsFromLookUps = (lookUps: IBaseLookUp[]): IDropdownOption[] => {
    return lookUps.map((lookUp) => {
        return {
            label: lookUp.value,
            value: lookUp.id,
        };
    });
};
