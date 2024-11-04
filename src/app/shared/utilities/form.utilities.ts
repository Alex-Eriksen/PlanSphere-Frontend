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

export const updateNestedControlsPathAndValue = (
    formGroup: FormGroup | FormArray,
    ignoreParent: boolean = false,
    parentKeys: string[] = [],
): { [key: string]: any } => {
    const controlPaths: { [key: string]: any } = {};
    Object.keys(formGroup.controls).forEach((controlName: string) => {
        const control = formGroup.get(controlName);
        if (control instanceof FormGroup || control instanceof FormArray) {
            Object.assign(
                controlPaths,
                updateNestedControlsPathAndValue(control, ignoreParent, [...parentKeys, controlName]),
            );
        } else if (control?.dirty) {
            if (control.valid) {
                control.markAsPristine();
                if (ignoreParent) {
                    controlPaths[controlName] = control.value;
                } else {
                    const keyPath = [...parentKeys, controlName].join("/");
                    controlPaths[keyPath] = control.value;
                }
            }
        }
    });
    return controlPaths;
};

export const castControlFromAbstractToFormControl = (control: AbstractControl): FormControl => {
    if (control instanceof FormControl) return control;
    return control as FormControl;
};

export const castControlFromAbstractToFormGroup = (control: AbstractControl): FormGroup => {
    if (control instanceof FormGroup) return control;
    return control as FormGroup;
};

export const castControlFromAbstractToFormArray = (control: AbstractControl): FormArray => {
    if (control instanceof FormArray) return control;
    return control as FormArray;
};
