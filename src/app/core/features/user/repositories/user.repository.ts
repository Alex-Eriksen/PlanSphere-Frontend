import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { Observable } from "rxjs";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { APIS } from "../../../api/plansphere.api";
import { IUser } from "../models/user.model";
import { IUserPayload } from "../utilities/user-payload";

@Injectable({
    providedIn: "root"
})
export class UserRepository {
    readonly #http = inject(HttpClient);

    createUser(bodyRequest: any): Observable<void> {
        return this.#http.post<void>(APIS.user.createUser(), bodyRequest);
    }

    getUserById(sourceLevelId: number): Observable<any> {
        return this.#http.get<IUser>(APIS.user.getUserById(sourceLevelId));
    }

    listUsers(params: IPaginationSortPayload): Observable<IPaginatedResponse> {
        return this.#http.get<IPaginatedResponse>(APIS.user.listUsers(), {
            params: new HttpParams({
                fromObject: { ...params },
            })
        });
    }

    patchUser(sourceLevelId: number, bodyRequest: any): Observable<void> {
        return this.#http.patch<void>(APIS.user.patchUser(sourceLevelId), bodyRequest);
    }

    updateUser(sourceLevelId: number, bodyRequest: IUserPayload): Observable<void> {
        return this.#http.put<void>(APIS.user.updateUser(sourceLevelId), bodyRequest);
    }

    deleteUser(sourceLevelId: number): Observable<void> {
        return this.#http.delete<void>(APIS.user.deleteUser(sourceLevelId));
    }
}
