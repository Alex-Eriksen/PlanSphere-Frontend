import { WorkScheduleDTO } from "./user.model";

export interface IUserSettings {
    isBirthdayPrivate: boolean;
    isEmailPrivate: boolean;
    isPhoneNumberPrivate: boolean;
    isAddressPrivate: boolean;
    workSchedule: WorkScheduleDTO;
    inheritWorkSchedule: boolean;
    autoCheckInOut: boolean;
    autoCheckOutDisabled: boolean;
}
