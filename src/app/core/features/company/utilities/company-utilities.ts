﻿import { map, OperatorFunction } from "rxjs";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { ICompany } from "../models/company.model";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { mapToSignalPaginatedResponse } from "../../../../shared/utilities/signals.utilities";
import { signal } from "@angular/core";

export const mapCompaniesToSignalSmallListInputOperator = (): OperatorFunction<
    IPaginatedResponse<ICompany>,
    ISignalPaginatedResponse<ISmallListTableInput>
> => {
    return map((paginatedCompanies)=> ({
        ...mapToSignalPaginatedResponse(paginatedCompanies),
        results: signal(mapCompaniesToSmallListInput(paginatedCompanies.results)),
    }));
};

const mapCompaniesToSmallListInput = (companies: ICompany[]): ISmallListTableInput[] => {
    return companies.map((companies) => ({
        ...companies,
        id: companies.id,
        name: companies.name,
        cvr: companies.cvr,
        contactName: companies.contactName,
        contactEmail: companies.contactEmail,
        contactPhoneNumber: companies.contactPhoneNumber,
        address: companies.address,
        careOf: companies.careOf,
        createdAt: companies.createdAt,
        createdBy: companies.createdBy

    }));
};
