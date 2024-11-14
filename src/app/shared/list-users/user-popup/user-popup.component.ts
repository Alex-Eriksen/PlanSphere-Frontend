import { Component, inject, input, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { NonNullableFormBuilder } from "@angular/forms";
import { IUserPopupInputs } from "./user-popup-inputs.interfaces";
import { Subscription, tap } from "rxjs";
import { markAllControlsAsTouchedAndDirty } from "../../utilities/form.utilities";
import { AddressInputComponent } from "../../address-input/address-input.component";
import { ButtonComponent } from "../../button/button.component";
import { DialogHeaderComponent } from "../../dialog-header/dialog-header.component";
import { InputComponent } from "../../input/input.component";
import { LoadingOverlayComponent } from "../../loading-overlay/loading-overlay.component";
import { SmallHeaderComponent } from "../../small-header/small-header.component";
import { TranslateModule } from "@ngx-translate/core";
import { IUserPayload } from "../../../core/features/users/utilities/user-payload";
import { UserService } from "../../../core/features/users/services/user.service";
import { userFormGroupBuilder } from "../../../core/features/users/utilities/userFormGroupBuilder.utilities";
import { NgIf } from "@angular/common";
import { SettingsComponent } from "../../../views/main/components/user/components/settings/settings.component";
import { WorkScheduleComponent } from "../../work-schedule/work-schedule.component";
import { RolesViewComponent } from "../../roles-view/roles-view.component";
import { SelectFieldComponent } from "../../select-field/select-field.component";
import { RoleService } from "../../../core/features/roles/services/role.service";
import { IDropdownOption } from "../../interfaces/dropdown-option.interface";

@Component({
  selector: 'ps-user-popup',
  standalone: true,
    imports: [
        AddressInputComponent,
        ButtonComponent,
        DialogHeaderComponent,
        InputComponent,
        LoadingOverlayComponent,
        SmallHeaderComponent,
        TranslateModule,
        NgIf,
        SettingsComponent,
        WorkScheduleComponent,
        RolesViewComponent,
        SelectFieldComponent
    ],
  templateUrl: './user-popup.component.html',
  styleUrl: './user-popup.component.scss'
})
export class UserPopupComponent implements OnInit, OnDestroy {
    readonly #userService = inject(UserService);
    readonly #roleService = inject(RoleService);
    readonly #matDialog = inject(MatDialog);
    readonly #fb = inject(NonNullableFormBuilder);
    formGroup!: any;
    readonly componentInputs: IUserPopupInputs = inject(MAT_DIALOG_DATA);
    userId = input.required<number>();
    isPageLoading: boolean = false;
    isFormSubmitting: boolean = false;
    roles: IDropdownOption[] = [];

    #loadUserSubscription: Subscription = new Subscription();

    ngOnInit(): void {
        this.isPageLoading = true;
        this.#loadRoles();
        this.formGroup = userFormGroupBuilder(this.#fb);
        if (this.componentInputs.isEditPopup) {
            this.#initializeEditPopup();
        } else {
            this.isPageLoading = false;
        }
    }

    #loadRoles(): void {
        this.#roleService.lookUpRoles(this.componentInputs.sourceLevel, this.componentInputs.sourceLevelId).subscribe({
            next: (roles) => this.roles = roles,
            error: (error) => console.error("Failed to fetch roles: ", error)
        });
    }

    ngOnDestroy() {
        this.#loadUserSubscription.unsubscribe();
    }

    submitForm(): void {
        if (this.formGroup.invalid) {
            markAllControlsAsTouchedAndDirty(this.formGroup);
            return;
        }
        this.isFormSubmitting = true;
        if (this.componentInputs.isEditPopup) {
            this.#userService.updateUser(this.componentInputs.userId, this.formGroup.value as IUserPayload)
                .subscribe({
                    next: () => {
                        this.isFormSubmitting = false;
                        this.closeDialog();
                    },
                });
        } else {
            this.#userService
                .createUser(this.formGroup.value, this.componentInputs.sourceLevel, this.componentInputs.sourceLevelId)
                .subscribe({
                    next: () => {
                        this.isFormSubmitting = false;
                        this.closeDialog();
                    },
                });
        }
    }

    closeDialog(): void {
        this.#matDialog.closeAll();
    }

    #initializeEditPopup(): void {
       this.#loadUserSubscription = this.#getUser().subscribe({
           complete: () =>
               this.isPageLoading = false
       });
    }

    #getUser() {
        return this.#userService.getUserDetails(this.componentInputs.userId!)
            .pipe(
                tap((user) =>
                    this.formGroup.patchValue(user)));
    }
}
