import { Component, inject, OnInit } from "@angular/core";
import { CompaniesListComponent } from "../../../../../../shared/list-companies/companies-list.component";
import { ILoggedInUser } from "../../../../../../core/features/authentication/models/logged-in-user.model";
import { AuthenticationService } from "../../../../../../core/features/authentication/services/authentication.service";
import { ToastService } from "../../../../../../core/services/error-toast.service";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";
import { IRightsListener } from "../../../../../../core/interfaces/rights-data.interface";
import { ISourceLevelRights } from "../../../../../../core/features/authentication/models/source-level-rights.model";


@Component({
    selector: 'ps-companies',
    standalone: true,
    imports: [
        CompaniesListComponent,
        LoadingOverlayComponent
    ],
    templateUrl: './companies.component.html',
    styleUrl: './companies.component.scss'
})
export class CompaniesComponent implements OnInit, IRightsListener {
    readonly #authenticationService = inject(AuthenticationService)
    readonly #toastService = inject(ToastService);
    organisationId: number = 0;
    isPageLoading: boolean = false;
    hasEditRights = false;

    ngOnInit() {
        this.isPageLoading = true;
        this.#fetchOrganisationIdFromUser()
    }

    #fetchOrganisationIdFromUser(): void {
        this.#authenticationService.getLoggedInUser().subscribe({
            next: (user : ILoggedInUser) => this.organisationId = user.organisationId,
            error: (error) => this.#toastService.showToast('ORGANISATION.DO_NOT_EXIST', error),
            complete: () => this.isPageLoading = false
        });
    }

    setRightsData(rights: ISourceLevelRights) {
        this.hasEditRights = rights.hasEditRights || rights.hasAdministratorRights;
    }
}
