import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { addressFormBuilderControl } from "../../address/utilities/address.utilities";

export function organisationFormGroupBuilder(fb: NonNullableFormBuilder): FormGroup {
    return fb.group({
        name: fb.control("", Validators.required),
        logoUrl: fb.control(""),
        address: addressFormBuilderControl(fb),
        settings: constructOrganisationSettingsFormGroup(fb),
        createdAt: fb.control({ value: new Date, disabled: true }),
    })
}

export const constructOrganisationSettingsFormGroup = (fb: NonNullableFormBuilder): FormGroup => {
    return fb.group({
        defaultRoleId: fb.control(0),
        defaultWorkScheduleId: fb.control(0),
    });
}
