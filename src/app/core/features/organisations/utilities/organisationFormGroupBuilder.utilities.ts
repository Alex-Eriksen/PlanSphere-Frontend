import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { addressFormBuilderControl } from "../../address/utilities/address.utilities";

export function organisationFormGroupBuilder(fb: FormBuilder): FormGroup {
    return fb.group({
        name: fb.control("", Validators.required),
        logoUrl: fb.control("", Validators.required),
        address: addressFormBuilderControl(fb),
        settings: fb.group({
            defaultRoleId: fb.control({ value: 1, disabled: true }),
            defaultWorkScheduleId: fb.control({ value: 1, disabled: true }),
        }),
        createdAt: fb.control({ value: new Date, disabled: true }),
    })
}
