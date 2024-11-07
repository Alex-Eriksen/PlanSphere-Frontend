import { map, OperatorFunction } from "rxjs";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { IDepartment } from "../models/department.model";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { mapToSignalPaginatedResponse } from "../../../../shared/utilities/signals.utilities";
import { signal } from "@angular/core";

export const mapDepartmentsToSignalSmallListInputOperator = (): OperatorFunction<
    IPaginatedResponse<IDepartment>,
    ISignalPaginatedResponse<ISmallListTableInput>
> => {
    return map((paginatedDepartments) => ({
        ...mapToSignalPaginatedResponse(paginatedDepartments),
        results: signal(mapDepartmentsToSmallListInput(paginatedDepartments.results)),
    }));
};

const mapDepartmentsToSmallListInput = (departments: IDepartment[]): ISmallListTableInput[] => {
    return departments.map((departments) => ({
        ...departments
    }));
};
