import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IUser } from "../models/user.model";
import { APIS } from "../../../api/plansphere.api";

@Injectable({
    providedIn: 'root'
})
export class UserRepository {
    readonly #http = inject(HttpClient);

    getUserDetails(userId?: number): Observable<IUser> {
        return this.#http.get<IUser>(APIS.users.getUserDetails(userId));
    }
}
