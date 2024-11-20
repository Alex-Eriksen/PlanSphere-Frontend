import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import { RolesViewComponent } from "../../../../../../shared/roles-view/roles-view.component";
import { AuthenticationService } from "../../../../../../core/features/authentication/services/authentication.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IRightsListener } from "../../../../../../core/interfaces/rights-data.interface";
import { ISourceLevelRights } from "../../../../../../core/features/authentication/models/source-level-rights.model";

@Component({
  selector: 'ps-roles',
  standalone: true,
    imports: [
        RolesViewComponent
    ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit, IRightsListener {
    readonly #authService = inject(AuthenticationService);
    readonly #destroyRef = inject(DestroyRef);

    sourceLevel = SourceLevel.Organisation;
    sourceLevelId!: number;
    hasEditRights: boolean = false;

    ngOnInit() {
        this.#authService.LoggedInUserObservable.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(loggedInUser => {
            if (!loggedInUser) return;
            this.sourceLevelId = loggedInUser.organisationId;
        })
    }

    setRightsData(rights: ISourceLevelRights) {
        this.hasEditRights = rights.hasAdministratorRights || rights.hasEditRights;
    }
}
