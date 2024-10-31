import { AuthenticationService } from "../features/authentication/services/authentication.service";
import { inject } from "@angular/core";
import { GlobalLoaderService } from "../services/global-loader.service";

export function authenticationInitializer(authService: AuthenticationService) {
    const globalLoaderService = inject(GlobalLoaderService);
    globalLoaderService.showLoader();
    return () => new Promise(resolve  => {
        authService.refreshToken().subscribe({
            next: () => globalLoaderService.hideLoader(),
            error: () => globalLoaderService.hideLoader()
        }).add(resolve(true));
    });
}
