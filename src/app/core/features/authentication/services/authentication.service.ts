import { inject, Injectable } from "@angular/core";
import { AuthenticationRepository } from "../repositories/authentication.repository";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { ILoggedInUser } from "../models/logged-in-user.model";
import { SourceLevel } from "../../../enums/source-level.enum";
import { ISourceLevelRights } from "../models/source-level-rights.model";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    readonly #authenticationRepository = inject(AuthenticationRepository);
    readonly #loggedInUserSubject$ = new BehaviorSubject<ILoggedInUser | null>(null);
    readonly LoggedInUserObservable = this.#loggedInUserSubject$.asObservable();
    readonly #tokenSubject$ = new BehaviorSubject<string | null>(null);
    readonly TokenObservable = this.#tokenSubject$.asObservable();

    get AccessToken(): string | null {
        return this.#tokenSubject$.value;
    }

    login(email: string,  password: string): Observable<string> {
        return this.#authenticationRepository.login(email,  password).pipe(tap(accessToken => {
            this.#tokenSubject$.next(accessToken);
        }));
    }

    revokeRefreshToken(token?: string): Observable<void> {
        return this.#authenticationRepository.revokeRefreshToken(token).pipe(tap(() => {
            this.#tokenSubject$.next(null);
        }));
    }

    refreshToken(): Observable<string> {
        return this.#authenticationRepository.refreshToken().pipe(tap(accessToken => {
            this.#tokenSubject$.next(accessToken);
        }));
    }

    getLoggedInUser(): Observable<ILoggedInUser> {
        return this.#authenticationRepository.getLoggedInUser().pipe(tap(loggedInUser => {
            this.#loggedInUserSubject$.next(loggedInUser);
        }));
    }

    isLoggedIn(): boolean {
        return this.#tokenSubject$.value !== "" && this.#tokenSubject$.value !== null;
    }

    getRights(sourceLevel?: SourceLevel, sourceLevelId?: number): Observable<ISourceLevelRights> {
        return this.#authenticationRepository.getRights(sourceLevel, sourceLevelId);
    }
}
