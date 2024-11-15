import { map, OperatorFunction } from "rxjs";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { ITeam } from "../models/team.model";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { mapToSignalPaginatedResponse } from "../../../../shared/utilities/signals.utilities";
import { signal } from "@angular/core";

export const mapTeamsToSignalSmallListInputOperator = (): OperatorFunction<
    IPaginatedResponse<ITeam>,
    ISignalPaginatedResponse<ISmallListTableInput>
> => {
    return map((paginatedTeams) => ({
        ...mapToSignalPaginatedResponse(paginatedTeams),
        results: signal(mapTeamsToSmallListInput(paginatedTeams.results)),
    }));
};

const mapTeamsToSmallListInput = (teams: ITeam[]): ISmallListTableInput[] => {
    return teams.map((team) => ({
        ...team,
        streetName: team.address.streetName,
        houseNumber: team.address.houseNumber,
        door: team.address.door,
        floor: team.address.floor,
    }));
};
