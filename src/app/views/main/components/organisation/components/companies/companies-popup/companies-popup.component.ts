import { OnDestroy, OnInit, inject } from "@angular/core";
import { CompanyService } from "../../../../../../../core/features/company/services/company.service";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { ICompaniesPopupInputs } from "./companies-popup-inputs.interface";
import { Subscription } from "rxjs";
import { markAllControlsAsTouchedAndDirty } from "../../../../../../../shared/utilities/form.utilities";
import { ICompanyRequest } from "../../../../../../../core/features/company/models/company-request.model";

export class CompaniesPopupComponent implements OnInit, OnDestroy{
    readonly #companyService = inject(CompanyService);
    readonly #matDialog = inject(MatDialog);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly componentInputs: ICompaniesPopupInputs = inject(MAT_DIALOG_DATA);
    isPageLoading: boolean = false;
    isFormSubmitting: boolean = false;

    #loadCompaniesSubscription: Subscription = new Subscription();

    fromGroup = this.#fb.group({
        name: this.#fb.control("", Validators.required),
        cvr: this.#fb.control("", Validators.required),
        address: this.#fb.group({
            streetName: this.#fb.control("", Validators.required),
            houseNumber: this.#fb.control("", Validators.required),
            door: this.#fb.control("", Validators.required),
            floor: this.#fb.control("", Validators.required),
            postalCode: this.#fb.control("", Validators.required),
            countryId: this.#fb.control("", Validators.required),
        }),
        careOf: this.#fb.control(""),
    })

    ngOnInit(): void {
        this.isPageLoading = true;
    }

    ngOnDestroy(): void {
        this.#loadCompaniesSubscription.unsubscribe();
    }

    submitForm(){
        if(!this.fromGroup.valid) {
            markAllControlsAsTouchedAndDirty(this.fromGroup)
            return;
        }
        this.isFormSubmitting = true;


        this.#companyService
            .createCompany(this.fromGroup.value as ICompanyRequest,
                ).subscribe({
            next:() => {
                this.isFormSubmitting = false;
                this.closeDialog();
            }
        })

    }

    closeDialog() {
        this.#matDialog.closeAll();
    }
}
