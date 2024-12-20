import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { APIS } from "../../../api/plansphere.api";
import { ILoggedInUser } from "../models/logged-in-user.model";
import { SourceLevel } from "../../../enums/source-level.enum";
import { ISourceLevelRights } from "../models/source-level-rights.model";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationRepository {
    readonly #http = inject(HttpClient);

    login(email: string,  password: string): Observable<string> {
        return this.#http.post<string>(APIS.authentication.login, { email, password }, {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            }),
            withCredentials: true
        });
    }

    revokeRefreshToken(token?: string): Observable<void> {
        return this.#http.post<void>(APIS.authentication.revokeToken, token, { withCredentials: true });
    }

    refreshToken(): Observable<string> {
        return this.#http.post<string>(APIS.authentication.refreshToken, {}, { withCredentials: true });
    }

    getLoggedInUser(): Observable<ILoggedInUser> {
        return this.#http.get<ILoggedInUser>(APIS.authentication.getLoggedInUser, {withCredentials: true});
    }

    getRights(sourceLevel?: SourceLevel, sourceLevelId?: number): Observable<ISourceLevelRights> {
        if (!sourceLevel || !sourceLevelId) {
            return this.#http.get<ISourceLevelRights>(APIS.users.getRights);
        } else {
            return this.#http.get<ISourceLevelRights>(APIS.authentication.getSourceLevelRights(sourceLevel, sourceLevelId))
        }
    }

    resetPassword(userId: number, emailToken: string, resetToken: string, password: string): Observable<void> {
        return this.#http.post<void>(APIS.authentication.resetPassword, {
            emailVerificationToken: emailToken,
            resetPasswordVerificationToken: resetToken,
            password: password,
            userId: userId
        }, { withCredentials: true });
    }

    requestPasswordReset(email: string): Observable<void> {
        return this.#http.post<void>(APIS.authentication.requestPasswordReset, {email: email}, {withCredentials: true});
    }
}
