import { KeycloakConfig } from "keycloak-js";

const keycloakConfigDevelopment: KeycloakConfig = {
    realm: "plansphere-dev",
    url: "http://localhost:8080/",
    clientId: "public-client",
};

export default keycloakConfigDevelopment;
