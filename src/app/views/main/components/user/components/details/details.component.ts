import { Component, inject, OnInit } from "@angular/core";
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";
import { AddressInputComponent } from "../../../../../../shared/address-input/address-input.component";
import { InputComponent } from "../../../../../../shared/input/input.component";
import { LineComponent } from "../../../../../../shared/line/line.component";
import { LoadingOverlayComponent } from "../../../../../../shared/loading-overlay/loading-overlay.component";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { userFormGroupBuilder } from "../../../../../../core/features/users/utilities/userFormGroupBuilder.utilities";
import { AuthenticationService } from "../../../../../../core/features/authentication/services/authentication.service";
import { UserService } from "../../../../../../core/features/users/services/user.service";
import { ToastService } from "../../../../../../core/services/error-toast.service";
import { updateNestedControlsPathAndValue } from "../../../../../../shared/utilities/form.utilities";
import { SettingsComponent } from "../settings/settings.component";

@Component({
  selector: 'ps-details',
  standalone: true,
    imports: [
        SmallHeaderComponent,
        AddressInputComponent,
        InputComponent,
        LineComponent,
        LoadingOverlayComponent,
        ReactiveFormsModule,
        SettingsComponent
    ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
    readonly #fb = inject(FormBuilder);
    readonly #authenticationService = inject(AuthenticationService);
    readonly #toastService = inject(ToastService);
    readonly #userService = inject(UserService);
    readonly #userId = this.#authenticationService.getUserId();
    formGroup!: any;
    isPageLoading: boolean = false;

    ngOnInit() {
        this.isPageLoading = true;
        if (this.#userId === undefined) {
            return;
        }
        this.getUserById(this.#userId);
        this.formGroup = userFormGroupBuilder(this.#fb);
    }

    getUserById(userId: number): void {
        this.#userService.getUserDetails(userId).subscribe({
            next: (user) => this.formGroup.patchValue(user),
            error: (error) => this.#toastService.showToast('USER.FIELD_TO_FETCH', error),
            complete: () => this.isPageLoading = false
        });
    }

    patchDetails(): void {
        const paths = updateNestedControlsPathAndValue(this.formGroup);
        if (Object.keys(paths).length) {
            this.#userService.patchUser(paths, this.#userId).subscribe();
        }
    }
}
