import { AuthenticationService } from "../features/authentication/services/authentication.service";

export function authenticationInitializer(authService: AuthenticationService) {
    return authService.refreshToken().subscribe();
}
