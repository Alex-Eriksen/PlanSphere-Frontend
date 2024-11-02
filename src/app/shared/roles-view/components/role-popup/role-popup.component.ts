import { Component, inject } from "@angular/core";
import { RoleService } from "../../../../core/features/roles/services/role.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IRolePopupInputs } from "./role-popup.inputs";
import { PopupHeaderComponent } from "../../../popup-header/popup-header.component";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonComponent } from "../../../button/button.component";
import { markAllControlsAsTouchedAndDirty } from "../../../utilities/form.utilities";
import { InputComponent } from "../../../input/input.component";
import { SmallHeaderComponent } from "../../../small-header/small-header.component";
import { finalize } from "rxjs";
import { CompanyService } from "../../../../core/features/companies/services/company.service";
import { SelectFieldComponent } from "../../../select-field/select-field.component";

@Component({
  selector: 'ps-role-popup',
  standalone: true,
    imports: [
        PopupHeaderComponent,
        ReactiveFormsModule,
        ButtonComponent,
        InputComponent,
        SmallHeaderComponent,
        SelectFieldComponent
    ],
  templateUrl: './role-popup.component.html',
  styleUrl: './role-popup.component.scss'
})
export class RolePopupComponent {
    readonly #roleService = inject(RoleService);
    readonly componentInputs: IRolePopupInputs = inject(MAT_DIALOG_DATA);
    readonly #dialogRef: MatDialogRef<RolePopupComponent> = inject(MatDialogRef);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #companyService = inject(CompanyService);
    isSubmitting = false;

    formGroup = this.#fb.group({
        request: this.#fb.group({
            name: this.#fb.control("", [Validators.required]),
            roleRightRequests: this.#fb.array([])
        })
    });

    closePopup(isCancel: boolean = false) {
        this.#dialogRef.close(isCancel);
    }

    submitForm() {
        if (!this.formGroup.valid) {
            markAllControlsAsTouchedAndDirty(this.formGroup);
            return;
        }
        this.isSubmitting = true;
        if (this.componentInputs.isEditPopup) {
            return;
        } else {
            this.#createRole();
        }
    }

    #createRole(){
        this.#roleService.createRole(this.componentInputs.sourceLevel, this.componentInputs.sourceLevelId, this.formGroup.value)
            .pipe(finalize(() => {
                this.isSubmitting = false;
                this.closePopup();
            })).subscribe();
    }
}
