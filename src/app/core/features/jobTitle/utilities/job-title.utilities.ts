import { map, OperatorFunction } from "rxjs";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { IJobTitle } from "../models/job-title.model";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { signal } from "@angular/core";
import { mapToSignalPaginatedResponse } from "../../../../shared/utilities/signals.utilities";
import { IDropdownOption } from "../../../../shared/interfaces/dropdown-option.interface";
import { IJobTitleLookUp } from "../models/job-title-look-up.model";

export const mapJobTitlesToSignalSmallListInputOperator = (): OperatorFunction<
    IPaginatedResponse<IJobTitle>,
    ISignalPaginatedResponse<ISmallListTableInput>
> => {
    return map((paginatedJobTitles) => ({
        ...mapToSignalPaginatedResponse(paginatedJobTitles),
        results: signal(mapJobTitlesToSmallListInput(paginatedJobTitles.results)),
    }));
};

const mapJobTitlesToSmallListInput = (jobTitles: IJobTitle[]): ISmallListTableInput[] => {
    return jobTitles.map((jobTitle) => ({
        ...jobTitle,
        title: jobTitle.name,
        active: jobTitle.isInheritanceActive,
    }));
};

export const mapJobTitleToDropdownOptions = (jobTitles: IJobTitleLookUp[]): IDropdownOption[] => {
    return jobTitles.map((jobTitle) => ({
        label: jobTitle.value,
        value: jobTitle.id,
    }));
}
