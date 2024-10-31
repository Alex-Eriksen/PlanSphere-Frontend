import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from "@angular/core";
import { AuthenticationService } from "../features/authentication/services/authentication.service";
import { environment } from "../../../environments/environment";

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthenticationService);
    const accessToken = authService.AccessToken;
    const isApiUrl = req.url.startsWith(environment.apiUrl);
    if (authService.isLoggedIn() && isApiUrl) {
        req.clone({
            setHeaders: { Authorization: `Bearer ${accessToken}`}
        });
    }
  return next(req);
};
