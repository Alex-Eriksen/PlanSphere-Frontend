import { inject, Injectable } from "@angular/core";
import { WorkTimeRepository } from "../repositories/work-time.repository";
import { IPeriod } from "../models/period.model";
import { Observable } from "rxjs";
import { IWorkTime } from "../models/work-time.models";
import { IWorkTimeRequest } from "../models/work-time-request";
import { WorkTimeType } from "../models/work-time-type.interface";
import { Period } from "../models/period.enum";

@Injectable({
  providedIn: 'root'
})
export class WorkTimeService {
    readonly #workTimeRepository = inject(WorkTimeRepository);

    getWorkTimesInMonth(params: IPeriod): Observable<IWorkTime[]> {
        return this.#workTimeRepository.getWorkTimesInMonth(params);
    }

    getWorkTimeWithinPeriod(workTimeType: WorkTimeType, period: Period): Observable<string> {
        return this.#workTimeRepository.getWorkTimeWithinPeriod(workTimeType, period);
    }

    createWorkTime(payload: IWorkTimeRequest): Observable<void> {
        return this.#workTimeRepository.createWorkTime(payload);
    }

    updateWorkTime(workItemId: number, payload: IWorkTimeRequest): Observable<void> {
        return this.#workTimeRepository.updateWorkTime(workItemId, payload);
    }

    deleteWorkTime(workItemId: number): Observable<void> {
        return this.#workTimeRepository.deleteWorkTime(workItemId);
    }

    checkIn() : Observable<void> {
        return this.#workTimeRepository.checkIn();
    }

    checkOut() : Observable<void> {
        return this.#workTimeRepository.checkOut();
    }
}
