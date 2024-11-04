import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { RoleService } from "../../../../core/features/roles/services/role.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IRolePopupInputs } from "./role-popup.inputs";
import { PopupHeaderComponent } from "../../../popup-header/popup-header.component";
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonComponent } from "../../../button/button.component";
import { markAllControlsAsTouchedAndDirty } from "../../../utilities/form.utilities";
import { InputComponent } from "../../../input/input.component";
import { SmallHeaderComponent } from "../../../small-header/small-header.component";
import { finalize, forkJoin, Observable, Subscription, tap } from "rxjs";
import { CompanyService } from "../../../../core/features/companies/services/company.service";
import { SelectFieldComponent } from "../../../select-field/select-field.component";
import { LineComponent } from "../../../line/line.component";
import { IRightLookUp } from "../../../../core/features/roles/models/RightLookUp";
import { LoadingOverlayComponent } from "../../../loading-overlay/loading-overlay.component";
import { IDropdownOption } from "../../../interfaces/dropdown-option.interface";
import { generateDropdownOptionsFromLookUps } from "../../../utilities/dropdown-option.utilities";
import { ICompanyLookUp } from "../../../../core/features/companies/models/company-look-up.model";
import { RightRequestItemComponent } from "./components/right-request-item/right-request-item.component";
import { SourceLevel } from "../../../../core/enums/source-level.enum";
import { OrganisationService } from "../../../../core/features/organisations/services/organisation.service";
import { IOrganisationLookUp } from "../../../../core/features/organisations/models/organisation-look-up.model";

@Component({
  selector: 'ps-role-popup',
  standalone: true,
    imports: [
        PopupHeaderComponent,
        ReactiveFormsModule,
        ButtonComponent,
        InputComponent,
        SmallHeaderComponent,
        SelectFieldComponent,
        LineComponent,
        LoadingOverlayComponent,
        RightRequestItemComponent
    ],
  templateUrl: './role-popup.component.html',
  styleUrl: './role-popup.component.scss'
})
export class RolePopupComponent implements OnInit, OnDestroy {
    readonly #roleService = inject(RoleService);
    readonly componentInputs: IRolePopupInputs = inject(MAT_DIALOG_DATA);
    readonly #dialogRef: MatDialogRef<RolePopupComponent> = inject(MatDialogRef);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #companyService = inject(CompanyService);
    readonly #organisationService = inject(OrganisationService);
    #rolePopupSubscription!: Subscription;
    isLoading = false;
    isSubmitting = false;

    roleRightRequests = this.#fb.array<FormGroup>([]);

    rightOptions: IDropdownOption[] = [];
    companyOptions: IDropdownOption[] = [];

    formGroup = this.#fb.group({
        request: this.#fb.group({
            name: this.#fb.control("", [Validators.required]),
            roleRightRequests: this.roleRightRequests
        })
    });

    ngOnInit() {
        this.isLoading = true;
        this.#rolePopupSubscription = forkJoin([
            this.#lookUpRights(),
            this.#lookUpCompanies(),
            this.#lookUpOrganisations()
        ]).subscribe(() => this.isLoading = false);
    }

    ngOnDestroy() {
        this.#rolePopupSubscription.unsubscribe();
    }

    #lookUpRights(): Observable<IRightLookUp[]> {
        return this.#roleService.lookUpRights().pipe(tap(value => this.rightOptions = generateDropdownOptionsFromLookUps(value)));
    }

    #lookUpCompanies(): Observable<ICompanyLookUp[]> {
        return this.#companyService.lookUpCompanies().pipe(tap((companies) => this.companyOptions = generateDropdownOptionsFromLookUps(companies)));
    }

    #lookUpOrganisations(): Observable<IOrganisationLookUp[]> {
        return this.#organisationService.lookUpOrganisations().pipe(tap(organisations => this))
    }

    closePopup(isCancel: boolean = false) {
        this.#dialogRef.close(isCancel);
    }

    submitForm() {
        if (!this.formGroup.valid) {
            markAllControlsAsTouchedAndDirty(this.formGroup);
            return;
        }
        this.isSubmitting = true;

        const roleRightRequestToAdd = [];

        for (const roleRightRequest of this.roleRightRequests.value) {
            const sourceLevelIds = Array.isArray(roleRightRequest.sourceLevelId) ? roleRightRequest.sourceLevelId : [roleRightRequest.sourceLevelId];
            const rightIds = Array.isArray(roleRightRequest.rightId) ? roleRightRequest.rightId : [roleRightRequest.rightId];

            for (const sourceLevelId of sourceLevelIds) {
                for (const rightId of rightIds) {
                    roleRightRequestToAdd.push({
                        sourceLevelId: sourceLevelId,
                        rightId: rightId,
                        sourceLevel: roleRightRequest.sourceLevel
                    });
                }
            }
        }

        const formGroupToAdd = {
            request: {
                name: this.formGroup.value.request!.name,
                roleRightRequests: roleRightRequestToAdd
            }
        };

        if (this.componentInputs.isEditPopup) {
            return;
        } else {
            this.#createRole(formGroupToAdd);
        }
    }

    #createRole(request: any){
        this.#roleService.createRole(this.componentInputs.sourceLevel, this.componentInputs.sourceLevelId, request)
            .pipe(finalize(() => {
                this.isSubmitting = false;
                this.closePopup();
            })).subscribe();
    }

    addRoleRightRequest() {
        this.roleRightRequests.push(this.#fb.group({
            sourceLevel: this.#fb.control<SourceLevel>(this.componentInputs.sourceLevel, Validators.required),
            sourceLevelId: this.#fb.control(0, Validators.required),
            rightId: this.#fb.control(this.rightOptions[0].value, Validators.required),
        }));
    }

    removeRoleRightRequest(formGroup: FormGroup) {
        const index = this.roleRightRequests.controls.findIndex(x => x === formGroup);
        this.roleRightRequests.removeAt(index);
    }
}
