import { Component, DestroyRef, inject, input, OnInit } from "@angular/core";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AuthenticationService } from "../../../../../../core/features/authentication/services/authentication.service";
import { ListUsersComponent } from "../../../../../../shared/list-users/list-users.component";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";

@Component({
  selector: 'ps-users',
  standalone: true,
    imports: [
        ListUsersComponent,
        LoadingOverlayComponent
    ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
    protected readonly SourceLevel = SourceLevel;
    sourceLevel = input.required<SourceLevel>();
    sourceLevelId = 0;
    companyId = input.required<number>();
    readonly #authenticationService = inject(AuthenticationService);
    readonly #destroyRef = inject(DestroyRef);
    userId!: number;
    isPageLoading: boolean = false;

    ngOnInit() {
        this.isPageLoading = true;
        this.#authenticationService.LoggedInUserObservable.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
            next: (user) => {
                if (user === null) return;
                this.sourceLevelId = this.companyId();
                this.isPageLoading = false;
            }
        });
    }
}
