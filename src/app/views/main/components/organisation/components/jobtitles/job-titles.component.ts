import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { SubHeaderComponent } from "../../../../../../shared/sub-header/sub-header.component";
import { ListJobTitlesComponent } from "../../../../../../shared/list-job-titles/list-job-titles.component";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import { IRightsListener } from "../../../../../../core/interfaces/rights-data.interface";
import { ISourceLevelRights } from "../../../../../../core/features/authentication/models/source-level-rights.model";
import { AuthenticationService } from "../../../../../../core/features/authentication/services/authentication.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";

@Component({
  selector: 'ps-job-titles',
  standalone: true,
    imports: [
        SmallHeaderComponent,
        SubHeaderComponent,
        ListJobTitlesComponent,
        LoadingOverlayComponent
    ],
  templateUrl: './job-titles.component.html',
  styleUrl: './job-titles.component.scss'
})
export class JobTitlesComponent implements OnInit, IRightsListener {
    readonly #authService = inject(AuthenticationService);
    readonly #destroyRef = inject(DestroyRef);
    protected readonly SourceLevel = SourceLevel;
    hasEditRights: boolean = false;
    isPageLoading = false;
    protected organisationId = 0;

    ngOnInit() {
        this.isPageLoading = true;
        this.#authService.LoggedInUserObservable
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((loggedInUser) => {
                if (!loggedInUser) return;
                this.organisationId = loggedInUser.organisationId;
                this.isPageLoading = false;
            });
    }

    setRightsData(rights: ISourceLevelRights) {
        this.hasEditRights = rights.hasAdministratorRights || rights.hasEditRights;
    }
}
