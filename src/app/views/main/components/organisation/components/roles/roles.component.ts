import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import { RolesViewComponent } from "../../../../../../shared/roles-view/roles-view.component";
import { AuthenticationService } from "../../../../../../core/features/authentication/services/authentication.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'ps-roles',
  standalone: true,
    imports: [
        RolesViewComponent
    ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {
    readonly #authService = inject(AuthenticationService);
    readonly #destroyRef = inject(DestroyRef);

    sourceLevel = SourceLevel.Organisation;
    sourceLevelId!: number;

    ngOnInit() {
        this.#authService.LoggedInUserObservable.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(loggedInUser => {
            if (!loggedInUser) return;
            this.sourceLevelId = loggedInUser.organisationId;
        })
    }
}
