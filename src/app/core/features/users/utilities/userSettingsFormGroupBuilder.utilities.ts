import { FormGroup, NonNullableFormBuilder } from "@angular/forms";

export function userSettingsFormGroupBuilder(fb: NonNullableFormBuilder): FormGroup {
    return fb.group({
        inheritWorkSchedule: fb.control(false),
        inheritedWorkScheduleId: fb.control<number | null>(null, {updateOn: "change"}),
        autoCheckInOut: fb.control(false),
        autoCheckOutDisabled: fb.control(false),
        isEmailPrivate: fb.control(false),
        isAddressPrivate: fb.control(false),
        isPhoneNumberPrivate: fb.control(false),
        isBirthdayPrivate: fb.control(false),
    });
}
