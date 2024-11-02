import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { Observable } from "rxjs";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { APIS } from "../../../api/plansphere.api";
import { SourceLevel } from "../../../enums/source-level.enum";
import { IJobTitlePayload } from "../models/job-title-payload";
import { IJobTitle } from "../models/job-title.model";

@Injectable({
    providedIn: "root"
})
export class JobTitleRepository {
    readonly #http = inject(HttpClient);

    getPaginatedJobTitles(params: IPaginationSortPayload, sourceLevel: SourceLevel, sourceLevelId: number) : Observable<IPaginatedResponse> {
        return this.#http.get<IPaginatedResponse>(APIS.jobTitles.listAll(sourceLevel, sourceLevelId), {
            params: new HttpParams({
                fromObject: { ...params },
            }),
        });
    }

    getJobTitle(id: number): Observable<IJobTitle> {
        return this.#http.get<IJobTitle>(APIS.jobTitles.getById(id));
    }

    createJobTitle(payload: IJobTitlePayload, sourceLevel: SourceLevel, sourceLevelId: number): Observable<void> {
        return this.#http.post<void>(APIS.jobTitles.create(sourceLevel, sourceLevelId), payload);
    }

    updateJobTitle(payload: IJobTitlePayload, sourceLevel: SourceLevel, sourceLevelId: number, jobTitleId: number): Observable<void> {
        return this.#http.put<void>(APIS.jobTitles.update(sourceLevel, sourceLevelId, jobTitleId), payload);
    }

    deleteJobTitle(jobTitleId: number): Observable<void> {
        return this.#http.delete<void>(APIS.jobTitles.delete(jobTitleId));
    }
}
