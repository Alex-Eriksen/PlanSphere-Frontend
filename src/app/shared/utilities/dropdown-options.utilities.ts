import { ILookUp } from "../interfaces/look-up.interface";
import { IDropdownOption } from "../interfaces/dropdown-option.interface";

export const generateDropdownOptionsFromLookUps = (lookUps: ILookUp[]): IDropdownOption[] => {
    return lookUps.map((lookUp) => {
        return {
            label: lookUp.value,
            value: lookUp.id,
        };
    });
};
