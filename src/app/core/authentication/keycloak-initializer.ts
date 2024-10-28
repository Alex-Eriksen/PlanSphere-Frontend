import { KeycloakOptions, KeycloakService } from "keycloak-angular";
import { environment } from "../../../environments/environment";

export function keycloakInitializer(keycloak: KeycloakService): () => Promise<boolean> {
    const keycloakConfig = environment.keycloakConfig;

    const options: KeycloakOptions = {
        config: keycloakConfig,
        loadUserProfileAtStartUp: true,
        initOptions: {
            onLoad: "check-sso",
            checkLoginIframe: false,
        },
        bearerExcludedUrls: [],
    };
    return () => keycloak.init(options);
}
