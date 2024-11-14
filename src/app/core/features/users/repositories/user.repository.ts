import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IUser } from "../models/user.model";
import { APIS } from "../../../api/plansphere.api";
import { IUserLookUp } from "../models/user-look-up.model";

@Injectable({
    providedIn: 'root'
})
export class UserRepository {
    readonly #http = inject(HttpClient);

    getUserDetails(userId?: number): Observable<IUser> {
        if (userId) {
            return this.#http.get<IUser>(APIS.users.getUserDetailsWithId(userId));
        } else {
            return this.#http.get<IUser>(APIS.users.getUserDetailsWithoutId);
        }
    }

    patchUserDetails(body: any, userId?: number) {
        if (userId) {
            return this.#http.patch<void>(APIS.users.patchUserWithId(userId), body);
        } else {
            return this.#http.patch<void>(APIS.users.patchUserWithoutId, body);
        }
    }

    lookUpUsers(organiationId?: number): Observable<IUserLookUp[]> {
        return this.#http.get<IUserLookUp[]>(APIS.users.lookUpUsers);
    }
}
