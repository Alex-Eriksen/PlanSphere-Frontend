import { Component, inject, OnInit } from "@angular/core";
import { LoadingOverlayComponent } from "../../../../shared/loading-overlay/loading-overlay.component";
import { ToastService } from "../../../../core/services/error-toast.service";
import { UserService } from "../../../../core/features/user/services/user.service";
import { AuthenticationService } from "../../../../core/features/authentication/services/authentication.service";
import { ListUsersComponent } from "../../../../shared/list-users/list-users.component";

@Component({
  selector: 'ps-user',
  standalone: true,
    imports: [
        LoadingOverlayComponent,
        ListUsersComponent
    ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
    sourceLevelId!: number;
    readonly #authenticationService = inject(AuthenticationService);
    readonly #toastService = inject(ToastService);
    readonly #userService = inject(UserService);
    isPageLoading: boolean = false;

    ngOnInit() {
        this.isPageLoading = true;
        this.fetchUserIdFromUser();
    }

    private fetchUserIdFromUser(): void {
        this.#authenticationService.getLoggedInUser().subscribe({
            next: (user) => this.sourceLevelId = user.organisationId,
            error: (error) => this.#toastService.showToast('ORGANISATION.DO_NOT_EXIST', error),
            complete: () => this.getUserById(this.sourceLevelId)
        });
    }

    getUserById(userId: number): void {
        this.#userService.getUserById(userId).subscribe({
            error: (error) => this.#toastService.showToast('USER.FIELD_TO_FETCH', error),
            complete: () => this.isPageLoading = false
        });
    }
}
