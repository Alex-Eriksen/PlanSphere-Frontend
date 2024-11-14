import { Component, inject, OnInit } from "@angular/core";
import { ListOrganisationsComponent } from "../../../../shared/list-organisations/list-organisations.component";
import { ILoggedInUser } from "../../../../core/features/authentication/models/logged-in-user.model";
import { AuthenticationService } from "../../../../core/features/authentication/services/authentication.service";
import { ToastService } from "../../../../core/services/error-toast.service";
import { IOrganisationDetails } from "../../../../core/features/organisations/models/organisation-details.model";
import { NonNullableFormBuilder } from "@angular/forms";
import { LoadingOverlayComponent } from "../../../../shared/loading-overlay/loading-overlay.component";
import { OrganisationService } from "../../../../core/features/organisations/services/organisation.service";
import {
    organisationFormGroupBuilder
} from "../../../../core/features/organisations/utilities/organisationFormGroupBuilder.utilities";

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
    formGroup!: any;
    isPageLoading: boolean = false;

    ngOnInit() {
        this.isPageLoading = true;
        this.formGroup = organisationFormGroupBuilder(this.#fb);
        this.fetchOrganisationIdFromUser();
    }

    private fetchOrganisationIdFromUser(): void {
        this.#authenticationService.getLoggedInUser().subscribe({
            next: (user : ILoggedInUser) => this.sourceLevelId = user.organisationId,
            error: (error) => this.#toastService.showToast('ORGANISATION.DO_NOT_EXIST', error),
            complete: () => this.getOrganisationDetail(this.sourceLevelId)
        });
    }

    getOrganisationDetail(id: number): void {
        this.#organisationService.getOrganisationDetailsById(id).subscribe({
            next: (organisation : IOrganisationDetails) => this.formGroup.patchValue(organisation),
            error: (error) => console.error('ORGANISATION.FIELD_TO_FETCH', error, this.sourceLevelId),
            complete: () => this.isPageLoading = false
        });
    }
}
