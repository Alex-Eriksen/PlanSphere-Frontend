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
    teamOptions: IDropdownOption[] = [];
    departmentOptions: IDropdownOption[] = [];

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
            // TODO: Add look up department and teams
            this.#getRoleById(),
        ]).subscribe(() => this.isLoading = false);
    }

    #initializeCreatePopup() {
        this.#rolePopupSubscription = forkJoin([
            this.#lookUpRights(),
            this.#lookUpCompanies(),
            this.#lookUpOrganisations(),
            // TODO: Add look up department and teams
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

        if (this.componentInputs.isEditPopup) {
            this.#updateRole(this.formGroup.value);
        } else {
            this.#createRole(this.formGroup.value);
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
                for (const right of role.rights) {
                    this.addRoleRightRequest(right);
                }
            }));
    }

    addRoleRightRequest(right?: any) {
        const fg: FormGroup = this.#fb.group({
            sourceLevel: this.#fb.control<SourceLevel>(right ? right.sourceLevel : this.componentInputs.sourceLevel, Validators.required),
            sourceLevelId: this.#fb.control(right ? right.sourceLevelId : 0, Validators.required),
            rightId: this.#fb.control(right ? right.rightId : this.rightOptions[0].value, Validators.required),
        });
        if (right) {
            fg.addControl("id", this.#fb.control(right.id));
        }

        this.roleRightRequests.push(fg);
    }

    removeRoleRightRequest(formGroup: FormGroup) {
        const index = this.roleRightRequests.controls.findIndex(x => x === formGroup);
        this.roleRightRequests.removeAt(index);
    }
}
