import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { SourceLevel } from "../../../enums/source-level.enum";
import { Observable } from "rxjs";
import { APIS } from "../../../api/plansphere.api";
import { IRightLookUp } from "../models/right-look-up.model";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { IRole } from "../models/role.model";
import { IRoleLookUp } from "../models/role-look-up.model";

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

    lookUpRoles(sourceLevel: SourceLevel, sourceLevelId: number): Observable<IRoleLookUp[]> {
        return this.#http.get<IRoleLookUp[]>(APIS.roles.lookUpRoles(sourceLevel, sourceLevelId));
    }

    deleteRole(sourceLevel: SourceLevel, sourceLevelId: number, roleId: number) : Observable<void> {
        return this.#http.delete<void>(APIS.roles.deleteRole(sourceLevel, sourceLevelId, roleId));
    }

    updateRole(sourceLevel: SourceLevel, sourceLevelId: number, roleId: number, body: any): Observable<void> {
        return this.#http.put<void>(APIS.roles.updateRole(sourceLevel, sourceLevelId, roleId), body);
    }

    getById(sourceLevel: SourceLevel, sourceLevelId: number, roleId: number): Observable<IRole> {
        return this.#http.get<IRole>(APIS.roles.getById(sourceLevel, sourceLevelId, roleId));
    }

    lookUpRights(): Observable<IRightLookUp[]> {
        return this.#http.get<IRightLookUp[]>(APIS.roles.lookUpRights);
    }

    toggleRoleInheritance(sourceLevel: SourceLevel, sourceLevelId: number,  roleId: number): Observable<void> {
        return this.#http.post<void>(APIS.roles.toggleRoleInheritance(sourceLevel, sourceLevelId, roleId), {});
    }
}
