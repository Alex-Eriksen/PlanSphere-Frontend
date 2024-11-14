import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { InputComponent } from "../../../../../../shared/input/input.component";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";
import { IOrganisationDetails } from "../../../../../../core/features/organisations/models/organisation-details.model";
import { SubHeaderComponent } from "../../../../../../shared/sub-header/sub-header.component";
import { ButtonComponent } from "../../../../../../shared/button/button.component";
import { updateNestedControlsPathAndValue } from "../../../../../../shared/utilities/form.utilities";
import { AuthenticationService } from "../../../../../../core/features/authentication/services/authentication.service";
import { ILoggedInUser } from "../../../../../../core/features/authentication/models/logged-in-user.model";
import { LineComponent } from "../../../../../../shared/line/line.component";
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { AddressInputComponent } from "../../../../../../shared/address-input/address-input.component";
import { ToastService } from "../../../../../../core/services/error-toast.service";
import { DialogService } from "../../../../../../core/services/dialog.service";
import { ListOrganisationsComponent } from "../../../../../../shared/list-organisations/list-organisations.component";
import { OrganisationPopupComponent } from "../../../../../../shared/list-organisations/organisation-popup/organisation-popup.component";
import { IRightsListener } from "../../../../../../core/interfaces/rights-data.interface";
import { ISourceLevelRights } from "../../../../../../core/features/authentication/models/source-level-rights.model";
import { organisationFormGroupBuilder } from "../../../../../../core/features/organisations/utilities/organisationFormGroupBuilder.utilities";
import { OrganisationService } from "../../../../../../core/features/organisations/services/organisation.service";

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
    organisation?: IOrganisationDetails;
    readonly #authenticationService = inject(AuthenticationService);
    readonly #organisationService = inject(OrganisationService);
    readonly #fb = inject(FormBuilder);
    formGroup!: any;
    readonly #toastService = inject(ToastService);
    readonly #dialogService = inject(DialogService);
    readonly #isDeletingOrganisation = signal(false);
    isPageLoading: boolean = false;
    rightsData!: ISourceLevelRights;

    ngOnInit(): void {
        this.isPageLoading = true;
        this.formGroup = organisationFormGroupBuilder(this.#fb);
        this.fetchOrganisationIdFromUser();
        if (!this.rightsData.hasEditRights && !this.rightsData.hasAdministratorRights) {
            this.formGroup.disable();
        }
    }

    // openDeleteDialog() : void {
    //     this.#dialogService.open(
    //         {
    //         title: 'ORGANISATION.DELETE.TITLE',
    //             tooltipLabel: "ORGANISATION.DELETE.TOOLTIP",
    //             callBack: () => this.deleteOrganisation(this.organisationId),
    //             submitLabel: "CONFIRM",
    //             isInputIncluded: false,
    //             descriptions: ["ORGANISATION.DELETE.QUESTION", "ORGANISATION.DELETE.CONFIRMATION"],
    //             isSubmitLoading: this.#isDeletingOrganisation,
    //             cancelLabel: "CANCEL",
    //         },
    //         "confirmation"
    //     );
    // }

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
            this.#organisationService.patch(this.organisationId, paths).subscribe();
        }
    }

    setRightsData(rights: ISourceLevelRights): void {
        this.rightsData = rights;
    }
}
