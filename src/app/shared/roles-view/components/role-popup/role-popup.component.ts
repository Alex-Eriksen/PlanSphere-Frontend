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
import { IRightLookUp } from "../../../../core/features/roles/models/right-look-up.model";
import { LoadingOverlayComponent } from "../../../loading-overlay/loading-overlay.component";
import { IDropdownOption } from "../../../interfaces/dropdown-option.interface";
import { generateDropdownOptionsFromLookUps } from "../../../utilities/dropdown-option.utilities";
import { ICompanyLookUp } from "../../../../core/features/companies/models/company-look-up.model";
import { RightRequestItemComponent } from "./components/right-request-item/right-request-item.component";
import { SourceLevel } from "../../../../core/enums/source-level.enum";
import { OrganisationService } from "../../../../core/features/organisations/services/organisation.service";
import { IOrganisationLookUp } from "../../../../core/features/organisations/models/organisation-look-up.model";
import { IRole } from "../../../../core/features/roles/models/role.model";

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
    organisationOptions: IDropdownOption[] = [];

    formGroup = this.#fb.group({
        name: this.#fb.control("", [Validators.required]),
        rights: this.roleRightRequests
    });

    ngOnInit() {
        this.isLoading = true;
        if (this.componentInputs.isEditPopup) {
            this.#initializeEditPopup();
        } else {
            this.#initializeCreatePopup();
        }
    }

    ngOnDestroy() {
        this.#rolePopupSubscription.unsubscribe();
    }

    #initializeEditPopup() {
        this.#rolePopupSubscription = forkJoin([
            this.#lookUpRights(),
            this.#lookUpCompanies(),
            this.#lookUpOrganisations(),
            this.#getRoleById(),
        ]).subscribe(() => this.isLoading = false);
    }

    #initializeCreatePopup() {
        this.#rolePopupSubscription = forkJoin([
            this.#lookUpRights(),
            this.#lookUpCompanies(),
            this.#lookUpOrganisations(),
        ]).subscribe(() => this.isLoading = false);
    }

    #lookUpRights(): Observable<IRightLookUp[]> {
        return this.#roleService.lookUpRights().pipe(tap(value => this.rightOptions = generateDropdownOptionsFromLookUps(value)));
    }

    #lookUpCompanies(): Observable<ICompanyLookUp[]> {
        return this.#companyService.lookUpCompanies().pipe(tap((companies) => this.companyOptions = generateDropdownOptionsFromLookUps(companies)));
    }

    #lookUpOrganisations(): Observable<IOrganisationLookUp[]> {
        return this.#organisationService.lookUpOrganisations()
            .pipe(tap(organisations => this.organisationOptions = generateDropdownOptionsFromLookUps(organisations)));
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
            name: this.formGroup.value!.name,
            rights: roleRightRequestToAdd
        };


        if (this.componentInputs.isEditPopup) {
            this.#updateRole(formGroupToAdd);
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

    #updateRole(request: any) {
        this.#roleService.updateRole(this.componentInputs.sourceLevel, this.componentInputs.sourceLevelId, this.componentInputs.roleId!, request)
            .pipe(finalize(() => {
            this.isSubmitting = false;
            this.closePopup();
        })).subscribe();
    }

    #getRoleById(): Observable<IRole> {
        return this.#roleService.getById(this.componentInputs.sourceLevel, this.componentInputs.sourceLevelId, this.componentInputs.roleId!)
            .pipe(tap((role) => {
                this.formGroup.patchValue(role);
                const sameRoleRightRequests: any[] = [];
                for (const right of role.rights) {
                    const existingRight = sameRoleRightRequests.find(x => x.sourceLevel === right.sourceLevel);
                    if (existingRight !== undefined) {
                        existingRight.rightId.push(right.rightId);
                        if (existingRight.sourceLevelId.find((x: number) => x === right.sourceLevelId) === undefined) {
                            existingRight.sourceLevelId.push(right.sourceLevelId);
                        }
                    }
                    else {
                        sameRoleRightRequests.push({
                            sourceLevelId: [right.sourceLevelId],
                            sourceLevel: right.sourceLevel,
                            rightId: [right.rightId]
                        });
                    }
                }
                for (const right of sameRoleRightRequests) {
                    this.addRoleRightRequest(right);
                }
            }));
    }

    addRoleRightRequest(right?: any) {
        this.roleRightRequests.push(this.#fb.group({
            sourceLevel: this.#fb.control<SourceLevel>(right ? right.sourceLevel : this.componentInputs.sourceLevel, Validators.required),
            sourceLevelId: this.#fb.control(right ? right.sourceLevelId : 0, Validators.required),
            rightId: this.#fb.control(right ? right.rightId : this.rightOptions[0].value, Validators.required),
        }));
    }

    removeRoleRightRequest(formGroup: FormGroup) {
        const index = this.roleRightRequests.controls.findIndex(x => x === formGroup);
        this.roleRightRequests.removeAt(index);
    }
}
