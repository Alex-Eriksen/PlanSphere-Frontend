import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SourceLevel } from "../../../enums/source-level.enum";
import { Observable } from "rxjs";
import { APIS } from "../../../api/plansphere.api";
import { IRightLookUp } from "../models/RightLookUp";

@Injectable({
    providedIn: 'root'
})
export class RoleRepository {
    readonly #http = inject(HttpClient);

    createRole(sourceLevel: SourceLevel, sourceLevelId: number, body: any): Observable<void> {
        return this.#http.post<void>(APIS.roles.createRole(sourceLevel, sourceLevelId), body);
    }

    lookUpRights(): Observable<IRightLookUp[]> {
        return this.#http.get<IRightLookUp[]>(APIS.roles.lookUpRights);
    }
}
