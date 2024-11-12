import { Component, inject, OnInit } from "@angular/core";
import { UserService } from "../../../../../../core/features/users/services/user.service";
import { AuthenticationService } from "../../../../../../core/features/authentication/services/authentication.service";
import { ToastService } from "../../../../../../core/services/error-toast.service";
import { ListUsersComponent } from "../../../../../../shared/list-users/list-users.component";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import { ListJobTitlesComponent } from "../../../../../../shared/list-job-titles/list-job-titles.component";

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
    readonly #authenticationService = inject(AuthenticationService);
    readonly #toastService = inject(ToastService);
    readonly #userService = inject(UserService);
    isPageLoading: boolean = false;
    readonly #userId = this.#authenticationService.getUserId();

    ngOnInit() {
        this.isPageLoading = true;
        if (this.#userId === undefined) {
            return;
        }
        this.getUserById(this.#userId);
    }

    getUserById(userId: number): void {
        this.#userService.getUserDetails(userId).subscribe({
            error: (error) => this.#toastService.showToast('USER.FIELD_TO_FETCH', error),
            complete: () => this.isPageLoading = false
        });
    }

}
