import { map, OperatorFunction } from "rxjs";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { signal } from "@angular/core";
import { mapToSignalPaginatedResponse } from "../../../../shared/utilities/signals.utilities";
import { IUser } from "../models/user.model";

export const mapUserToSignalSmallListInputOperator = (): OperatorFunction<IPaginatedResponse<IUser>, ISignalPaginatedResponse<ISmallListTableInput>
> => {
    return map((paginatedUsers) => ({
        ...mapToSignalPaginatedResponse(paginatedUsers),
        results: signal(mapUsersToSmallListInput(paginatedUsers.results)),
    }));
};

const mapUsersToSmallListInput = (users: IUser[]): ISmallListTableInput[] => {
    return users.map((user) => ({
        ...user,
    }));
}
