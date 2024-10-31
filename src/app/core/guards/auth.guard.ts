import { ResolveFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthenticationService } from "../features/authentication/services/authentication.service";

export const AuthGuard: ResolveFn<boolean> = (
    route,
    state
) => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);
    const isLoggedIn = authService.isLoggedIn();
    if (isLoggedIn) {
        return true;
    } else {
        router.navigate(['/sign-in'], { queryParams: { returnUrl: state.url } });
    }
    return true;
};
