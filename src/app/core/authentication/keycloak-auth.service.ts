import { inject, Injectable } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { DOCUMENT } from "@angular/common";

@Injectable({
    providedIn: "root",
})
export class KeycloakAuthService {
    #document = inject(DOCUMENT);
    #keycloakService = inject(KeycloakService);

    public isLoggedIn(): boolean {
        return this.#keycloakService.isLoggedIn();
    }

    public loginAndRedirectTo(url: string): void {
        this.#keycloakService.login({ redirectUri: url });
    }

    public loginWithGoogleAndRedirectTo(url: string): Promise<void> {
        return this.#keycloakService.login({ idpHint: "google", redirectUri: url });
    }

    public logout(): void {
        this.#keycloakService.logout(this.#document.location.origin);
    }

    public getToken(): string {
        return this.#keycloakService.getKeycloakInstance().token!;
    }
}
