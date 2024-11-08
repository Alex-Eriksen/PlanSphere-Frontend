import { Component, inject, OnInit, signal } from "@angular/core";
import { OrganisationService } from "../../../../../../core/features/organisation/services/organisation.service";
import { IOrganisation } from "../../../../../../core/features/organisation/models/organisation.model";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
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

@Component({
    selector: 'ps-details',
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
        OrganisationPopupComponent,
    ],
    templateUrl: './details.component.html',
    styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
    organisationId! : number;
    organisation?: IOrganisation;
    //organisationDetails?: IOrganisationDetails;
    readonly #authenticationService = inject(AuthenticationService);
    readonly #organisationService = inject(OrganisationService);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #toastService = inject(ToastService);
    readonly #dialogService = inject(DialogService);
    readonly #isDeletingOrganisation = signal(false);
    isPageLoading: boolean = false;

    ngOnInit(): void {
        this.isPageLoading = true;
        this.fetchOrganisationIdFromUser();
    }

    formGroup = this.#fb.group({
        name: this.#fb.control("", Validators.required),
        logoUrl: this.#fb.control("", Validators.required),
        address: this.#fb.group({
            streetName: this.#fb.control(""),
            houseNumber: this.#fb.control(""),
            door: this.#fb.control(""),
            floor: this.#fb.control(""),
            postalCode: this.#fb.control(""),
            countryId: this.#fb.control(""),
        }),
        settings: this.#fb.group({
            defaultRoleId: this.#fb.control({ value: 1, disabled: true }),
            defaultWorkScheduleId: this.#fb.control({ value: 1, disabled: true }),
        }),
        createdAt: this.#fb.control({ value: new Date, disabled: true }),
    });

    openDeleteDialog() : void {
        this.#dialogService.open(
            {
            title: 'ORGANISATION.DELETE.TITLE',
                tooltipLabel: "ORGANISATION.DELETE.TOOLTIP",
                callBack: () => this.deleteOrganisation(this.organisationId),
                submitLabel: "CONFIRM",
                isInputIncluded: false,
                descriptions: ["ORGANISATION.DELETE.QUESTION", "ORGANISATION.DELETE.CONFIRMATION"],
                isSubmitLoading: this.#isDeletingOrganisation,
                cancelLabel: "CANCEL",
            },
            "confirmation"
        );
    }

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

    deleteOrganisation(id: number): void {
        this.#organisationService.delete(id).subscribe();
    }
}
