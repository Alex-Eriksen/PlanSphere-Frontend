import { map, OperatorFunction } from "rxjs";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { IOrganisation } from "../models/organisation.model";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { mapToSignalPaginatedResponse } from "../../../../shared/utilities/signals.utilities";

export const mapOrganisationToSignalSmallListInputOperator = (): OperatorFunction<IPaginatedResponse<IOrganisation>, ISignalPaginatedResponse<ISmallListTableInput>
> => {
    return map((paginatedOrganisations) => ({
        ...mapToSignalPaginatedResponse(paginatedOrganisations),
    }));
};
