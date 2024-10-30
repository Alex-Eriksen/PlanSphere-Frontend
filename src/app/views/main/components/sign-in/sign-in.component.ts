import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { InputComponent } from "../../../../shared/input/input.component";
import { NgOptimizedImage } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'ps-sign-in',
  standalone: true,
    imports: [
        ReactiveFormsModule,
        InputComponent,
        NgOptimizedImage,
        TranslateModule
    ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {
    readonly #fb = inject(NonNullableFormBuilder);
    readonly #route = inject(ActivatedRoute);
    readonly #router = inject(Router);
    readonly #destroyRef = inject(DestroyRef);
    #returnUrl: string = "/";

    readonly formGroup = this.#fb.group({
       email: this.#fb.control("", [Validators.required, Validators.email]),
       password: this.#fb.control("", [Validators.required, Validators.minLength(8)]),
    });

    ngOnInit() {
        this.#route.queryParams.pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(params => {
            this.#returnUrl = params['returnUrl'] || '/';
        });
    }

    signIn() {
        // TODO: Add authenticate call.
        this.#router.navigate([ this.#returnUrl ]);
    }

    forgotPassword() {
        // TODO: Add forgot password call.
    }
}
