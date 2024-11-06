import { map, OperatorFunction } from "rxjs";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { signal } from "@angular/core";
import { mapToSignalPaginatedResponse } from "../../../../shared/utilities/signals.utilities";
import { IRoleListItem } from "../models/role-list-item.model";
import { IRole } from "../models/role.model";

export const mapRolesToSignalSmallListInputOperator = (): OperatorFunction<
    IPaginatedResponse<IRoleListItem>,
    ISignalPaginatedResponse<ISmallListTableInput>
> => {
    return map((paginatedJobTitles) => ({
        ...mapToSignalPaginatedResponse(paginatedJobTitles),
        results: signal(mapJobTitlesToSmallListInput(paginatedJobTitles.results)),
    }));
};

const mapJobTitlesToSmallListInput = (roles: IRoleListItem[]): ISmallListTableInput[] => {
    return roles.map((role) => ({
        ...role,
        title: role.name,
        active: role.isInheritanceActive,
    }));
};

