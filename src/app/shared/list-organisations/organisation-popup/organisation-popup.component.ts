import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { OrganisationService } from "../../../core/features/organisation/services/organisation.service";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { IOrganisationPopupInputs } from "./organisation-popup-inputs.interfaces";
import { Observable, Subscription, tap } from "rxjs";
import { markAllControlsAsTouchedAndDirty } from "../../utilities/form.utilities";
import { IOrganisationDetails } from "../../../core/features/organisation/models/organisation-details.model";
import { IOrganisationPayload } from "../../../core/features/organisation/models/organisation-payload";
import { ButtonComponent } from "../../button/button.component";
import { DialogHeaderComponent } from "../../dialog-header/dialog-header.component";
import { InputComponent } from "../../input/input.component";
import { LoadingOverlayComponent } from "../../loading-overlay/loading-overlay.component";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { SmallHeaderComponent } from "../../small-header/small-header.component";
import { TranslateModule } from "@ngx-translate/core";
import { AddressInputComponent } from "../../address-input/address-input/address-input.component";

@Component({
  selector: 'ps-organisation-popup',
  standalone: true,
    imports: [
        ButtonComponent,
        DialogHeaderComponent,
        InputComponent,
        LoadingOverlayComponent,
        MatSlideToggle,
        SmallHeaderComponent,
        TranslateModule,
        AddressInputComponent
    ],
  templateUrl: './organisation-popup.component.html',
  styleUrl: './organisation-popup.component.scss'
})
export class OrganisationPopupComponent implements OnInit, OnDestroy {
    readonly #organisationService = inject(OrganisationService);
    readonly #matDialog = inject(MatDialog);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly componentInputs: IOrganisationPopupInputs = inject(MAT_DIALOG_DATA);
    isPageLoading: boolean = false;
    isFormSubmitting: boolean = false;

    #loadOrganisationSubscription: Subscription = new Subscription();

    formGroup = this.#fb.group({
        name: this.#fb.control("", Validators.required),
        logoUrl: this.#fb.control(""),
        address: this.#fb.group({
            streetName: this.#fb.control(""),
            houseNumber: this.#fb.control(""),
            door: this.#fb.control(""),
            floor: this.#fb.control(""),
            postalCode: this.#fb.control(""),
            countryId: this.#fb.control(""),
        }),
        settings: this.#fb.group({
            defaultRoleId: this.#fb.control({ value: 1, disabled: false }),
            defaultWorkScheduleId: this.#fb.control({ value: 1, disabled: false }),
        }),
        createdAt: this.#fb.control({ value: new Date, disabled: true })
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
        this.#loadOrganisationSubscription.unsubscribe();
    }

    submitForm(): void {
        if (this.formGroup.invalid) {
            markAllControlsAsTouchedAndDirty(this.formGroup);
            return;
        }
        this.isFormSubmitting = true;
        if (this.componentInputs.isEditPopup) {
            this.#organisationService.update(this.componentInputs.sourceLevelId!, this.formGroup.value as IOrganisationPayload)
                .subscribe({
                    next: () => {
                        this.isFormSubmitting = false;
                        this.closeDialog();
                    },
                });
        } else {
            this.#organisationService
                .createOrganisation(this.formGroup.value)
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
        this.#loadOrganisationSubscription = this.#getOrganisation().subscribe({
            complete: () => {
                this.isPageLoading = false;
            }
        });
    }

    #getOrganisation(): Observable<IOrganisationDetails> {
        return this.#organisationService.getOrganisationDetailsById(this.componentInputs.sourceLevelId!)
            .pipe(
                tap((organisation) => {
                    this.formGroup.patchValue(organisation)
                }));
    }
}
