import { Component, DestroyRef, inject, input, OnInit } from "@angular/core";
import { AuthenticationService } from "../../../../../../core/features/authentication/services/authentication.service";
import { ListUsersComponent } from "../../../../../../shared/list-users/list-users.component";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import { ListJobTitlesComponent } from "../../../../../../shared/list-job-titles/list-job-titles.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'ps-users',
  standalone: true,
    imports: [
        ListUsersComponent,
        LoadingOverlayComponent,
        ListJobTitlesComponent
    ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
    protected readonly SourceLevel = SourceLevel;
    userId!: number;
    sourceLevelId = 0;
    sourceLevel = input.required<SourceLevel>();
    readonly #authenticationService = inject(AuthenticationService);
    readonly #destroyRef = inject(DestroyRef);
    isPageLoading: boolean = false;

    ngOnInit() {
        this.isPageLoading = true;
        this.#authenticationService.LoggedInUserObservable.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
            next: (user) => {
                if (user === null) return;
                this.sourceLevelId = user?.organisationId;
                this.isPageLoading = false;

            }
        });
    }
}
