import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { SourceLevel } from "../../../enums/source-level.enum";
import { Observable } from "rxjs";
import { APIS } from "../../../api/plansphere.api";
import { IRightLookUp } from "../models/RightLookUp";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";

@Injectable({
    providedIn: 'root'
})
export class RoleRepository {
    readonly #http = inject(HttpClient);

    createRole(sourceLevel: SourceLevel, sourceLevelId: number, body: any): Observable<void> {
        return this.#http.post<void>(APIS.roles.createRole(sourceLevel, sourceLevelId), body);
    }

    getPaginatedRoles(params: IPaginationSortPayload, sourceLevel: SourceLevel, sourceLevelId: number) : Observable<IPaginatedResponse> {
        return this.#http.get<IPaginatedResponse>(APIS.roles.listAll(sourceLevel, sourceLevelId), {
            params: new HttpParams({
                fromObject: { ...params },
            }),
        });
    }

    lookUpRights(): Observable<IRightLookUp[]> {
        return this.#http.get<IRightLookUp[]>(APIS.roles.lookUpRights);
    }
}
