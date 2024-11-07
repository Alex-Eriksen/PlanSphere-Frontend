import { map, OperatorFunction } from "rxjs";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { IOrganisation } from "../models/organisation.model";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { mapToSignalPaginatedResponse } from "../../../../shared/utilities/signals.utilities";
import { signal } from "@angular/core";

export const mapOrganisationToSignelSmallListInputOperator = (): OperatorFunction<IPaginatedResponse<IOrganisation>, ISignalPaginatedResponse<ISmallListTableInput>
> => {
    return map((paginatedOrganisations) => ({
        ...mapToSignalPaginatedResponse(paginatedOrganisations),
        results: signal(mapOrganisationsToSmallListInput(paginatedOrganisations.results)),
    }));
};

const mapOrganisationsToSmallListInput = (organisations: IOrganisation[]): ISmallListTableInput[] => {
    return organisations.map((organisation) => ({
        ...organisation,
        title: organisation.name,
        organisationMembers: organisation.organisationMembers,
        departmentMembers: organisation.departmentMembers,
        companyMembers: organisation.companyMembers,
        teamMembers: organisation.teamMembers,
    }));
}
