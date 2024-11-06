import { Component, inject, OnInit } from "@angular/core";
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
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";

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
        AddressInputComponent
    ],
    templateUrl: './details.component.html',
    styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
    organisationId! : number;
    organisation?: IOrganisation;
    organisationDetails?: IOrganisationDetails;
    readonly #authenticationService = inject(AuthenticationService);
    readonly #organisationService = inject(OrganisationService);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #toastService = inject(ToastService);
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
        createdAt: this.#fb.control({ value: new Date, disabled: true }),
    });

    private fetchOrganisationIdFromUser(): void {
        this.#authenticationService.getLoggedInUser().subscribe({
            next: (user : ILoggedInUser) => this.organisationId = user.organisationId,
            error: (error) => this.#toastService.showToast('ORGANISATION.DO_NOT_EXIST', error),
            complete: () => this.getOrganisationDetail(SourceLevel.Organisation, this.organisationId)
        });
    }

    getOrganisationDetail(sourceLevel: SourceLevel ,id: number): void {
        this.#organisationService.getOrganisationDetailsById(sourceLevel, id).subscribe({
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
        this.#organisationService.delete(SourceLevel.Organisation, id).subscribe();
    }
}
