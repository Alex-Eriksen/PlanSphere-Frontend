import { AuthenticationService } from "../features/authentication/services/authentication.service";
import { inject } from "@angular/core";
import { GlobalLoaderService } from "../services/global-loader.service";

export function authenticationInitializer(authService: AuthenticationService) {
    const globalLoaderService = inject(GlobalLoaderService);
    globalLoaderService.showLoader();
    return () => new Promise(resolve  => {
        authService.refreshToken().subscribe({
            next: () => authService.getLoggedInUser().subscribe({
                next: () => globalLoaderService.hideLoader()
            }).add(resolve(true)),
            error: () => globalLoaderService.hideLoader()
        }).add(resolve(true));
    });
}
