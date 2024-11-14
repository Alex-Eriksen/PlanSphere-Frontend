import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { addressFormBuilderControl } from "../../address/utilities/address.utilities";
import { constructWorkScheduleFormGroup } from "../../workSchedules/utilities/work-schedule.utilities";

export function organisationFormGroupBuilder(fb: NonNullableFormBuilder): FormGroup {
    return fb.group({
        name: fb.control("", Validators.required),
        logoUrl: fb.control("", Validators.required),
        address: addressFormBuilderControl(fb),
        settings: constructWorkScheduleFormGroup(fb),
        createdAt: fb.control({ value: new Date, disabled: true }),
    })
}
