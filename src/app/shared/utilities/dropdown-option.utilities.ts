import { IDropdownOption } from "../interfaces/dropdown-option.interface";
import { IBaseLookUp } from "../../core/abstract/models/base-look.model";
import { formatDateWithoutTimezone } from "./date.utilities";

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

export const generateDropdownOptionsFromLookUps = <T = number>(lookUps: IBaseLookUp<T>[]): IDropdownOption[] => {
    return lookUps.map((lookUp) => {
        return {
            label: lookUp.value,
            value: lookUp.id,
        };
    });
};

export const generateHourAndMinuteDropdownOptions = (): IDropdownOption[] => {
    const options: IDropdownOption[] = [];
    const padZero = (num: number): string => num.toString().padStart(2, '0');

    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 5) {
            const time = `${padZero(hour)}:${padZero(minute)}`;
            options.push({
                label: time,
                value: time.concat(':00'),
            });
        }
    }

    return options;
}

export const generateHalfHourDropdownOptions = (selectedDate: Date): IDropdownOption[] => {
    const options: IDropdownOption[] = [];
    const totalHalfHoursInDay = 24 * 2;

    for (let i = 0; i < totalHalfHoursInDay; i++) {
        const hours = Math.floor(i / 2);
        const minutes = i % 2 === 0 ? 0 : 30;

        const label = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

        const dateValue = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        dateValue.setHours(hours, minutes, 0, 0);

        options.push({
            label: label,
            value: formatDateWithoutTimezone(dateValue)
        });
    }

    return options;
}
