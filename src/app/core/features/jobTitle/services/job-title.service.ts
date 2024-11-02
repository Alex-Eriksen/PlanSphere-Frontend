import { inject, Injectable } from "@angular/core";
import { JobTitleRepository } from "../repositories/job-title.repository";
import { Observable } from "rxjs";
import { IJobTitle } from "../models/job-title.model";
import { IJobTitlePayload } from "../models/job-title-payload";
import { SourceLevel } from "../../../enums/source-level.enum";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { mapJobTitlesToSignalSmallListInputOperator } from "../utilities/job-title.utilities";

@Injectable({
    providedIn: 'root'
})
export class JobTitleService {
    readonly #jobTitleRepository = inject(JobTitleRepository);

    getJobTitles(
        params: IPaginationSortPayload,
        sourceLevel: SourceLevel,
        sourceLevelId: number
    ): Observable<ISignalPaginatedResponse<ISmallListTableInput>> {
        return this.#jobTitleRepository.getPaginatedJobTitles(params, sourceLevel, sourceLevelId).pipe(mapJobTitlesToSignalSmallListInputOperator());
    }

    getJobTitle(id: number): Observable<IJobTitle> {
        return this.#jobTitleRepository.getJobTitle(id);
    }

    createJobTitle(payload: IJobTitlePayload, sourceLevel: SourceLevel, sourceLevelId: number): Observable<void> {
        return this.#jobTitleRepository.createJobTitle(payload, sourceLevel, sourceLevelId);
    }

    updateJobTitle(payload: IJobTitlePayload, sourceLevel: SourceLevel, sourceLevelId: number, id: number): Observable<void> {
        return this.#jobTitleRepository.updateJobTitle(payload, sourceLevel, sourceLevelId, id);
    }

    deleteJobTitle(id: number): Observable<void> {
        return this.#jobTitleRepository.deleteJobTitle(id);
    }

    toggleInheritance(payload: boolean, id: number): Observable<void> {
        return this.#jobTitleRepository.toggleInheritance(payload, id);
    }
}
