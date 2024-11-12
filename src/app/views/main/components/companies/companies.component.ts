import { Component, inject, OnInit } from "@angular/core";
import { CompaniesListComponent } from "../../../../shared/list-companies/companies-list.component";
import { RouterOutlet } from "@angular/router";
import { AuthenticationService } from "../../../../core/features/authentication/services/authentication.service";
import { ToastService } from "../../../../core/services/error-toast.service";
import { ILoggedInUser } from "../../../../core/features/authentication/models/logged-in-user.model";
import { LoadingOverlayComponent } from "../../../../shared/loading-overlay/loading-overlay.component";


@Component({
  selector: 'ps-companies',
  standalone: true,
    imports: [
        CompaniesListComponent,
        RouterOutlet,
        LoadingOverlayComponent
    ],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent  implements OnInit {
    readonly #authenticationService = inject(AuthenticationService)
    readonly #toastService = inject(ToastService);
    organisationId: number = 0;
    isPageLoading: boolean = false;


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
}
