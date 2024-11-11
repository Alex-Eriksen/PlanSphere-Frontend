import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { UserService } from "../../../core/features/user/services/user.service";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { NonNullableFormBuilder } from "@angular/forms";
import { IUserPopupInputs } from "./user-popup-inputs.interfaces";
import { Subscription, tap } from "rxjs";
import { markAllControlsAsTouchedAndDirty } from "../../utilities/form.utilities";
import { AddressInputComponent } from "../../address-input/address-input/address-input.component";
import { ButtonComponent } from "../../button/button.component";
import { DialogHeaderComponent } from "../../dialog-header/dialog-header.component";
import { InputComponent } from "../../input/input.component";
import { LoadingOverlayComponent } from "../../loading-overlay/loading-overlay.component";
import { SmallHeaderComponent } from "../../small-header/small-header.component";
import { TranslateModule } from "@ngx-translate/core";
import { IUserPayload } from "../../../core/features/user/utilities/user-payload";

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
        TranslateModule
    ],
  templateUrl: './user-popup.component.html',
  styleUrl: './user-popup.component.scss'
})
export class UserPopupComponent implements OnInit, OnDestroy {
    readonly #userService = inject(UserService);
    readonly #matDialog = inject(MatDialog);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly componentInputs: IUserPopupInputs = inject(MAT_DIALOG_DATA);
    isPageLoading: boolean = false;
    isFormSubmitting: boolean = false;

    #loadUserSubscription: Subscription = new Subscription();

    formGroup = this.#fb.group({
        firstName: this.#fb.control(""),
        lastName: this.#fb.control(""),
        email: this.#fb.control(""),
        phoneNumber: this.#fb.control(""),
        address: this.#fb.group({
            streetName: this.#fb.control(""),
            houseNumber: this.#fb.control(""),
            door: this.#fb.control(""),
            floor: this.#fb.control(""),
            postalCode: this.#fb.control(""),
            countryId: this.#fb.control(""),
        }),
        settings: this.#fb.group({
            isBirthdayPrivate: this.#fb.control({value: true, disabled: false}),
            isEmailPrivate:this.#fb.control({value: true, disabled: false}),
            isPhoneNumberPrivate:this.#fb.control({value: true, disabled: false}),
            isAddressPrivate:this.#fb.control({value: true, disabled: false}),
            inheritWorkSchedule:this.#fb.control({value: true, disabled: false}),
            inheritedWorkScheduleId:this.#fb.control({value: 0, disabled: false}),
            autoCheckInOut:this.#fb.control({value: true, disabled: false}),
            autoCheckOutDisabled:this.#fb.control({value: true, disabled: false})
        })
    });

    ngOnInit(): void {
        this.isPageLoading = true;
        if (this.componentInputs.isEditPopup) {
            this.#initializeEditPopup();
        } else {
            this.isPageLoading = false;
        }
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
            this.#userService.updateUser(this.componentInputs.sourceLevelId!, this.formGroup.value as IUserPayload)
                .subscribe({
                    next: () => {
                        this.isFormSubmitting = false;
                        this.closeDialog();
                    },
                });
        } else {
            this.#userService
                .createUser(this.formGroup.value)
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
        return this.#userService.getUserById(this.componentInputs.sourceLevelId!)
            .pipe(
                tap((user) =>
                    this.formGroup.patchValue(user)));
    }

}
