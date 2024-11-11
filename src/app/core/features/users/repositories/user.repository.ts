import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { IUser } from "../models/user.model";
import { APIS } from "../../../api/plansphere.api";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { IUserPayload } from "../utilities/user-payload";

@Injectable({
    providedIn: 'root'
})
export class UserRepository {
    readonly #http = inject(HttpClient);

    createUser(bodyRequest: any): Observable<void> {
        return this.#http.post<void>(APIS.users.createUser(), bodyRequest);
    }

    getUserDetails(userId?: number): Observable<IUser> {
        if (userId) {
            return this.#http.get<IUser>(APIS.users.getUserDetailsWithId(userId));
        } else {
            return this.#http.get<IUser>(APIS.users.getUserDetailsWithoutId);
        }
    }

    listUsers(params: IPaginationSortPayload): Observable<IPaginatedResponse> {
        return this.#http.get<IPaginatedResponse>(APIS.users.listUsers(), {
            params: new HttpParams({
                fromObject: { ...params },
            })
        });
    }

    patchUserDetails(body: any, userId?: number) {
        if (userId) {
            return this.#http.patch<void>(APIS.users.patchUserWithId(userId), body);
        } else {
            return this.#http.patch<void>(APIS.users.patchUserWithoutId, body);
        }
    }

    updateUser(sourceLevelId: number, bodyRequest: IUserPayload): Observable<void> {
        return this.#http.put<void>(APIS.users.updateUser(sourceLevelId), bodyRequest);
    }

    deleteUser(sourceLevelId: number): Observable<void> {
        return this.#http.delete<void>(APIS.users.deleteUser(sourceLevelId));
    }
}
