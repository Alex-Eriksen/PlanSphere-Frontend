import { inject, Injectable } from "@angular/core";
import { TeamRepository } from "../repositories/team.repository";
import { SourceLevel } from "../../../enums/source-level.enum";
import { Observable } from "rxjs";
import { ITeam } from "../models/team.model";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { mapTeamsToSignalSmallListInputOperator } from "../utilities/team-utilities";

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    readonly #teamRepository = inject(TeamRepository);

    getTeamById(sourceLevelId: number, sourceLevel: SourceLevel, teamId: number): Observable<ITeam> {
        return this.#teamRepository.getById(sourceLevelId, sourceLevel, teamId)
    }

    listTeams(sourceLevelId: number, params: IPaginationSortPayload, isUserTeams: boolean): Observable<ISignalPaginatedResponse<ISmallListTableInput>> {
        return this.#teamRepository.listTeams(sourceLevelId, params, isUserTeams).pipe(mapTeamsToSignalSmallListInputOperator());
    }

    deleteTeam(sourceLevelId: number, teamId: number): Observable<void> {
        return this.#teamRepository.delete(sourceLevelId, teamId)
    }

    patchTeams(sourceLevelId: number, bodyRequest: any): Observable<void> {
        return this.#teamRepository.patch(sourceLevelId, bodyRequest)
    }
}
