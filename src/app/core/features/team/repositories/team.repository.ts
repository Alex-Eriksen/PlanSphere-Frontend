import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { SourceLevel } from "../../../enums/source-level.enum";
import { Observable } from "rxjs";
import { ITeam } from "../models/team.model";
import { APIS } from "../../../api/plansphere.api";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { ITeamLookUp } from "../models/team-look-up.model";

@Injectable({
    providedIn: 'root'
})
export class TeamRepository {
    readonly #http = inject(HttpClient);

    getById(sourceLevelId: number, sourceLevel: SourceLevel, teamId: number): Observable<ITeam>{
        return this.#http.get<ITeam>(APIS.team.getById(sourceLevelId, sourceLevel, teamId));
    }

    listTeams(sourceLevelId: number, params: IPaginationSortPayload, isUserTeams: boolean): Observable<IPaginatedResponse> {
        const endpoint = isUserTeams ? APIS.team.listUserTeams : APIS.team.listTeams(sourceLevelId);
        return this.#http.get<IPaginatedResponse>(endpoint, {
            params: new HttpParams({
                fromObject: {...params},
            }),
        });
    }

    create(sourceLevelId: number, team: ITeam): Observable<void>{
        return this.#http.post<void>(APIS.team.create(sourceLevelId), team)
    }

    patch(sourceLevelId: number, bodyRequest: any): Observable<void>{
        return this.#http.patch<void>(APIS.team.patch(sourceLevelId), bodyRequest)
    }

    delete(sourceLevelId: number, teamId: number): Observable<void>{
        return this.#http.delete<void>(APIS.team.delete(sourceLevelId, teamId));
    }

    lookUpTeams(): Observable<ITeamLookUp[]> {
        return this.#http.get<ITeamLookUp[]>(APIS.team.lookUpTeams);
    }
}
