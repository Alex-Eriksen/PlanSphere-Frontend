import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ButtonComponent } from "../../../../shared/button/button.component";
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputComponent } from "../../../../shared/input/input.component";
import { NgOptimizedImage } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { AuthenticationService } from "../../../../core/features/authentication/services/authentication.service";
import { markAllControlsAsTouchedAndDirty } from "../../../../shared/utilities/form.utilities";
import { EmailVerificationIdentifier, EmailVerificationToken, ResetPasswordToken } from "../../../../core/constants/query-parameters.constants";

@Component({
  selector: 'ps-reset-password',
  standalone: true,
    imports: [
        ButtonComponent,
        FormsModule,
        InputComponent,
        NgOptimizedImage,
        TranslateModule,
        ReactiveFormsModule
    ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
    readonly #route = inject(ActivatedRoute);
    readonly #router = inject(Router);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #authService = inject(AuthenticationService);
    formGroup = this.#fb.group({
        password: this.#fb.control("", [Validators.required]),
        confirmPassword: this.#fb.control("", [Validators.required]),
    });
    emailControl = this.#fb.control("", [Validators.required, Validators.email]);
    isLoading = false;
    userId: number | undefined;
    emailToken: string | undefined;
    resetToken: string | undefined;
    requestSent = false;

    ngOnInit() {
        this.#route.queryParams.subscribe({
            next: value => {
                this.userId = value[EmailVerificationIdentifier];
                this.emailToken = value[EmailVerificationToken];
                this.resetToken = value[ResetPasswordToken];
            }
        });
    }

    resetPassword() {
        if (this.formGroup.invalid) {
            markAllControlsAsTouchedAndDirty(this.formGroup);
            return;
        }

        if (this.formGroup.controls.password.value !== this.formGroup.controls.confirmPassword.value) {
            return;
        }

        this.#authService.resetPassword(this.userId!, this.emailToken!, this.resetToken!, this.formGroup.controls.password.value).subscribe(() => {
            this.#router.navigate(["/sign-in"]);
        });
    }

    requestPasswordReset() {
        if (this.emailControl.invalid){
            markAllControlsAsTouchedAndDirty(this.emailControl);
            return;
        }

        this.#authService.requestPasswordReset(this.emailControl.value).subscribe(() => this.requestSent = true);
    }
}
