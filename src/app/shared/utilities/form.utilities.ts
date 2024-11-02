import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";

export const markControlAsTouchedAndDirty = (abstractControl: AbstractControl, onlySelf = false): void => {
    abstractControl.markAsDirty({ onlySelf });
    abstractControl.markAsTouched({ onlySelf });
};

export const markAllControlsAsTouchedAndDirty = (abstractControl: AbstractControl, onlySelf = false): void => {
    if (abstractControl instanceof FormControl) {
        markControlAsTouchedAndDirty(abstractControl);
        return;
    } else if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray)
        Object.keys(abstractControl.controls).forEach((key) => {
            const control = abstractControl.get(key);
            markControlAsTouchedAndDirty(control!, onlySelf);
            if (control instanceof FormGroup || control instanceof FormArray) {
                markAllControlsAsTouchedAndDirty(control);
            }
        });
};
