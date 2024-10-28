import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { KeycloakAuthService } from "../authentication/keycloak-auth.service";

export const AuthGuard: ResolveFn<boolean> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    document: Document = inject(DOCUMENT),
) => {
    const keycloakAuthService = inject(KeycloakAuthService);
    const isLoggedIn = keycloakAuthService.isLoggedIn();
    try {
        if (isLoggedIn) {
            return true;
        } else {
            const redirectUrl = `${document.location.origin}`;
            console.log(redirectUrl);
            keycloakAuthService.loginAndRedirectTo(redirectUrl);
        }
        return false;
    } catch (e) {
        console.log(e);
        return false;
    }
};
