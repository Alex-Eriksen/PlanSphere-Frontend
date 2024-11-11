import { FormBuilder, FormGroup } from "@angular/forms";
import { addressFormBuilderControl } from "../../address/utilities/address.utilities";
import { userSettingsFormGroupBuilder } from "./userSettingsFormGroupBuilder.utilities";

export function userFormGroupBuilder(fb: FormBuilder): FormGroup {
    return fb.group({
        firstName: fb.control(""),
        lastName: fb.control(""),
        email: fb.control(""),
        phoneNumber: fb.control(""),
        address: addressFormBuilderControl(fb),
        settings: userSettingsFormGroupBuilder(fb)
    });
}
