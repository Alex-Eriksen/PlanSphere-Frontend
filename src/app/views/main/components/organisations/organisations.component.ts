import { Component, inject, OnInit } from "@angular/core";
import { ListOrganisationsComponent } from "../../../../shared/list-organisations/list-organisations.component";
import { ILoggedInUser } from "../../../../core/features/authentication/models/logged-in-user.model";
import { AuthenticationService } from "../../../../core/features/authentication/services/authentication.service";
import { ToastService } from "../../../../core/services/error-toast.service";
import { IOrganisationDetails } from "../../../../core/features/organisations/models/organisation-details.model";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { LoadingOverlayComponent } from "../../../../shared/loading-overlay/loading-overlay.component";
import { OrganisationService } from "../../../../core/features/organisations/services/organisation.service";

@Component({
  selector: 'ps-organisations',
  standalone: true,
    imports: [
        LoadingOverlayComponent,
        ListOrganisationsComponent,
        LoadingOverlayComponent
    ],
  templateUrl: './organisations.component.html',
  styleUrl: './organisations.component.scss'
})
export class OrganisationsComponent implements OnInit{
    sourceLevelId!: number;
    readonly #authenticationService = inject(AuthenticationService);
    readonly #toastService = inject(ToastService);
    readonly #organisationService = inject(OrganisationService);
    readonly #fb = inject(NonNullableFormBuilder);
    isPageLoading: boolean = false;

    ngOnInit() {
        this.isPageLoading = true;
        this.fetchOrganisationIdFromUser();
    }

    organisationFormGroup = this.#fb.group({
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

    private fetchOrganisationIdFromUser(): void {
        this.#authenticationService.getLoggedInUser().subscribe({
            next: (user : ILoggedInUser) => this.sourceLevelId = user.organisationId,
            error: (error) => this.#toastService.showToast('ORGANISATION.DO_NOT_EXIST', error),
            complete: () => this.getOrganisationDetail(this.sourceLevelId)
        });
    }

    getOrganisationDetail(id: number): void {
        this.#organisationService.getOrganisationDetailsById(id).subscribe({
            next: (organisation : IOrganisationDetails) => this.organisationFormGroup.patchValue(organisation),
            error: (error) => console.error('ORGANISATION.FIELD_TO_FETCH', error, this.sourceLevelId),
            complete: () => this.isPageLoading = false
        });
    }
}
