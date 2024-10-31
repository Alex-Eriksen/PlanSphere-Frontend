import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { APIS } from "../../../api/plansphere.api";
import { ILoggedInUser } from "../models/logged-in-user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationRepository {
    readonly #http = inject(HttpClient);

    login(email: string,  password: string): Observable<string> {
        return this.#http.post<string>(APIS.authentication.login, { email, password });
    }

    revokeRefreshToken(token?: string): Observable<void> {
        return this.#http.post<void>(APIS.authentication.revokeToken, token);
    }

    refreshToken(): Observable<string> {
        return this.#http.post<string>(APIS.authentication.refreshToken, {});
    }

    getLoggedInUser(): Observable<ILoggedInUser> {
        return this.#http.get<ILoggedInUser>(APIS.authentication.getLoggedInUser);
    }
}
