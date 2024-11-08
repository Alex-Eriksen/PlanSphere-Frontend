import { FormBuilder, FormGroup } from "@angular/forms";

export const addressFormBuilderUtilities = (formBuilder: FormBuilder): FormGroup => {
    return formBuilder.group({
        streetName: (""),
        houseNumber: (""),
        door: (""),
        floor: (""),
        postalCode: (""),
        countryId: (""),
    });

}
