import { IWorkSchedule } from "../../workSchedules/models/work-schedule.model";

export interface IUserSettings {
    isBirthdayPrivate: boolean;
    isEmailPrivate: boolean;
    isPhoneNumberPrivate: boolean;
    isAddressPrivate: boolean;
    workSchedule: IWorkSchedule;
    inheritWorkSchedule: boolean;
    autoCheckInOut: boolean;
    autoCheckOutDisabled: boolean;
}
