import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { InputComponent } from "../../../../shared/input/input.component";
import { NgOptimizedImage } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { AuthenticationService } from "../../../../core/features/authentication/services/authentication.service";
import { ButtonComponent } from "../../../../shared/button/button.component";

@Component({
  selector: 'ps-sign-in',
  standalone: true,
    imports: [
        ReactiveFormsModule,
        InputComponent,
        NgOptimizedImage,
        TranslateModule,
        ButtonComponent
    ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #route = inject(ActivatedRoute);
    readonly #router = inject(Router);
    readonly #destroyRef = inject(DestroyRef);
    readonly #authService = inject(AuthenticationService);
    isLoading = false;
    #returnUrl: string = "/";

    readonly formGroup = this.#fb.group({
       email: this.#fb.control("", [Validators.required, Validators.email]),
       password: this.#fb.control("", [Validators.required, Validators.minLength(8)]),
    });

    ngOnInit() {
        this.#authService.TokenObservable.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
            next: token => {
                if (token === null || token === "") {
                    return;
                }
                this.#router.navigate([this.#returnUrl]);
            }
        });

        this.#route.queryParams.pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(params => {
            this.#returnUrl = params['returnUrl'] || '/';
        });
    }

    signIn() {
        if (!this.formGroup.valid) {
            this.formGroup.markAsDirty();
            this.formGroup.markAsTouched();
            return;
        }

        this.isLoading = true;
        this.#authService.login(this.formGroup.value.email!, this.formGroup.value.password!).subscribe({
            next: () => {
                this.isLoading = false;
                this.#router.navigate([this.#returnUrl]);
            }
        });
    }

    forgotPassword() {
        // TODO: Add forgot password call.
    }
}
