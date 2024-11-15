import { NonNullableFormBuilder } from "@angular/forms";
import { addressFormBuilderControl } from "../../address/utilities/address.utilities";

export function userFormGroupBuilder(fb: NonNullableFormBuilder) {
    return fb.group({
        firstName: fb.control(""),
        lastName: fb.control(""),
        email: fb.control(""),
        phoneNumber: fb.control(""),
        address: addressFormBuilderControl(fb),
        roleIds: fb.control([]),
    });
}
