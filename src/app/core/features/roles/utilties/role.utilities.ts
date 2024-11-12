import { map, OperatorFunction } from "rxjs";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { signal } from "@angular/core";
import { mapToSignalPaginatedResponse } from "../../../../shared/utilities/signals.utilities";
import { IRoleListItem } from "../models/role-list-item.model";
import { SourceLevelTranslationMapper } from "../../../mappers/source-level-translation.mapper";

export const mapRolesToSignalSmallListInputOperator = (): OperatorFunction<
    IPaginatedResponse<IRoleListItem>,
    ISignalPaginatedResponse<ISmallListTableInput>
> => {
    return map((paginatedJobTitles) => ({
        ...mapToSignalPaginatedResponse(paginatedJobTitles),
        results: signal(mapRolesToSmallListInput(paginatedJobTitles.results)),
    }));
};

const mapRolesToSmallListInput = (roles: IRoleListItem[]): ISmallListTableInput[] => {
    return roles.map((role) => ({
        ...role,
        title: role.name,
        active: role.isInheritanceActive,
        sourceLevel: SourceLevelTranslationMapper.get(role.sourceLevel),
        rawSourceLevel: role.sourceLevel
    }));
};

