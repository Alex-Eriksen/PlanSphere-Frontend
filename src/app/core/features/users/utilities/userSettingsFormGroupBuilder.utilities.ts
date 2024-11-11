import { FormBuilder, FormGroup } from "@angular/forms";

export function userSettingsFormGroupBuilder(fb: FormBuilder): FormGroup {
    return fb.group({
        isBirthdayPrivate: fb.control({ value: true, disabled: false }),
        isEmailPrivate: fb.control({ value: true, disabled: false }),
        isPhoneNumberPrivate: fb.control({ value: true, disabled: false }),
        isAddressPrivate: fb.control({ value: true, disabled: false }),
        inheritWorkSchedule: fb.control({ value: true, disabled: false }),
        inheritedWorkScheduleId: fb.control({ value: 0, disabled: false }),
        autoCheckInOut: fb.control({ value: true, disabled: false }),
        autoCheckOutDisabled: fb.control({ value: true, disabled: false })
    });
}
