import { Component, inject, OnInit, signal } from "@angular/core";
import { OrganisationService } from "../../../../../../core/features/organisation/services/organisation.service";
import { IOrganisation } from "../../../../../../core/features/organisation/models/organisation.model";
import { FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputComponent } from "../../../../../../shared/input/input.component";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";
import { IOrganisationDetails } from "../../../../../../core/features/organisation/models/organisation-details.model";
import { SubHeaderComponent } from "../../../../../../shared/sub-header/sub-header.component";
import { ButtonComponent } from "../../../../../../shared/button/button.component";
import { updateNestedControlsPathAndValue } from "../../../../../../shared/utilities/form.utilities";
import { AuthenticationService } from "../../../../../../core/features/authentication/services/authentication.service";
import { ILoggedInUser } from "../../../../../../core/features/authentication/models/logged-in-user.model";
import { LineComponent } from "../../../../../../shared/line/line.component";
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { AddressInputComponent } from "../../../../../../shared/address-input/address-input/address-input.component";
import { ToastService } from "../../../../../../core/services/error-toast.service";
import { DialogService } from "../../../../../../core/services/dialog.service";
import {
    ListOrganisationsComponent
} from "../../../../../../shared/list-organisations/list-organisations.component";
import { OrganisationPopupComponent } from "../../../../../../shared/list-organisations/organisation-popup/organisation-popup.component";
import { addressFormBuilderControle } from "../../../../../../core/features/address/utilities/address.utilities";
import { IRightsListener } from "../../../../../../core/interfaces/rights-data.interface";
import { ISourceLevelRights } from "../../../../../../core/features/authentication/models/source-level-rights.model";

@Component({
    selector: "ps-details",
    standalone: true,
    imports: [
        InputComponent,
        LoadingOverlayComponent,
        SubHeaderComponent,
        ReactiveFormsModule,
        ButtonComponent,
        LineComponent,
        SmallHeaderComponent,
        AddressInputComponent,
        ListOrganisationsComponent,
        OrganisationPopupComponent
    ],
    templateUrl: "./details.component.html",
    styleUrl: "./details.component.scss"
})
export class DetailsComponent implements OnInit, IRightsListener {
    organisationId! : number;
    organisation?: IOrganisation;
    readonly #authenticationService = inject(AuthenticationService);
    readonly #organisationService = inject(OrganisationService);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #toastService = inject(ToastService);
    readonly #dialogService = inject(DialogService);
    readonly #isDeletingOrganisation = signal(false);
    isPageLoading: boolean = false;
    rightsData!: ISourceLevelRights;

    ngOnInit(): void {
        this.isPageLoading = true;
        this.fetchOrganisationIdFromUser();
        if (!this.rightsData.hasEditRights && !this.rightsData.hasAdministratorRights) {
            this.formGroup.disable();
        }
    }

    formGroup = this.#fb.group({
        name: this.#fb.control("", Validators.required),
        logoUrl: this.#fb.control("", Validators.required),
        address: addressFormBuilderControle(this.#fb as FormBuilder),
        settings: this.#fb.group({
            defaultRoleId: this.#fb.control({ value: 0, disabled: true }),
            defaultWorkScheduleId: this.#fb.control({ value: 0, disabled: true }),
        }),
        createdAt: this.#fb.control({ value: new Date, disabled: true }),
    });

    private fetchOrganisationIdFromUser(): void {
        this.#authenticationService.getLoggedInUser().subscribe({
            next: (user : ILoggedInUser) => this.organisationId = user.organisationId,
            error: (error) => this.#toastService.showToast('ORGANISATION.DO_NOT_EXIST', error),
            complete: () => this.getOrganisationDetail(this.organisationId)
        });
    }

    getOrganisationDetail(id: number): void {
        this.#organisationService.getOrganisationDetailsById(id).subscribe({
            next: (organisation : IOrganisationDetails) => this.formGroup.patchValue(organisation),
            error: (error) => console.error('ORGANISATION.FIELD_TO_FETCH', error, this.organisationId),
            complete: () => this.isPageLoading = false
        });
    }

    patchDetails(): void {
        const paths = updateNestedControlsPathAndValue(this.formGroup);
        if (Object.keys(paths).length) {
            this.#organisationService.patch(this.organisationId, paths).subscribe()
        }
    }

    setRightsData(rights: ISourceLevelRights): void {
        this.rightsData = rights;
    }
}
