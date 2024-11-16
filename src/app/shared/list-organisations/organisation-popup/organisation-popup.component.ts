import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { NonNullableFormBuilder } from "@angular/forms";
import { IOrganisationPopupInputs } from "./organisation-popup-inputs.interfaces";
import { Observable, Subscription, tap } from "rxjs";
import { markAllControlsAsTouchedAndDirty } from "../../utilities/form.utilities";
import { IOrganisationDetails } from "../../../core/features/organisations/models/organisation-details.model";
import { IOrganisationPayload } from "../../../core/features/organisations/models/organisation-payload";
import { ButtonComponent } from "../../button/button.component";
import { DialogHeaderComponent } from "../../dialog-header/dialog-header.component";
import { InputComponent } from "../../input/input.component";
import { LoadingOverlayComponent } from "../../loading-overlay/loading-overlay.component";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { SmallHeaderComponent } from "../../small-header/small-header.component";
import { TranslateModule } from "@ngx-translate/core";
import { AddressInputComponent } from "../../address-input/address-input.component";
import { OrganisationService } from "../../../core/features/organisations/services/organisation.service";
import { organisationFormGroupBuilder } from "../../../core/features/organisations/utilities/organisation.utilities";

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
    formGroup = organisationFormGroupBuilder(this.#fb);
    readonly componentInputs: IOrganisationPopupInputs = inject(MAT_DIALOG_DATA);
    isPageLoading: boolean = false;
    isFormSubmitting: boolean = false;

    #loadOrganisationSubscription: Subscription = new Subscription();

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
