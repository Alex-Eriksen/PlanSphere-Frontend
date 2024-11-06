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
            error: (error) => console.error('No organisationId found for the user.', error),
            complete: () => this.getOrganisationDetail(this.organisationId)
        });
    }

    getOrganisationDetail(id: number): void {
        this.#organisationService.getOrganisationDetailsById(id).subscribe({
            next: (organisation : IOrganisationDetails) => this.formGroup.patchValue(organisation),
            error: (error) => console.error('Failed to fetch organisation details:', error, this.organisationId),
            complete: () => this.isPageLoading = false
        });
    }

    patchDetails(): void {
        const paths = updateNestedControlsPathAndValue(this.formGroup);
        console.log(paths);
        if (Object.keys(paths).length) {
            this.#organisationService.patch(this.organisationId, paths).subscribe()
        }
    }

    deleteOrganisation(id: number): void {
        this.#organisationService.delete(id).subscribe();
    }
}
