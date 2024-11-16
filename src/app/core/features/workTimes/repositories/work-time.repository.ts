import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { APIS } from "../../../api/plansphere.api";
import { IWorkTime } from "../models/work-time.models";
import { IPeriod } from "../models/period.model";
import { IWorkTimeRequest } from "../models/work-time-request";

@Injectable({
    providedIn: 'root'
})
export class WorkTimeRepository {
    readonly #http = inject(HttpClient);

    getWorkTimesInMonth(params: IPeriod): Observable<IWorkTime[]> {
        return this.#http.get<IWorkTime[]>(APIS.workTimes.getWorkTimesInMonth, {
            params: new HttpParams({
                fromObject: { ...params },
            }),
        });
    }

    createWorkTime(payload: IWorkTimeRequest): Observable<void> {
        return this.#http.post<void>(APIS.workTimes.createWorkTime, payload);
    }

    updateWorkTime(workItemId: number, payload: IWorkTimeRequest): Observable<void> {
        return this.#http.put<void>(APIS.workTimes.updateWorkTime(workItemId), payload);
    }

    deleteWorkTime(workItemId: number): Observable<void> {
        return this.#http.delete<void>(APIS.workTimes.deleteWorkTime(workItemId));
    }

    checkIn() : Observable<void> {
        return this.#http.post<void>(APIS.workTimes.checkIn, {});
    }

    checkOut() : Observable<void> {
        return this.#http.post<void>(APIS.workTimes.checkOut, {});
    }
}
