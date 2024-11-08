import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IWorkScheduleLookUp } from "../models/work-schedule-look-up.model";
import { APIS } from "../../../api/plansphere.api";
import { IWorkSchedule } from "../models/work-schedule.model";
import { SourceLevel } from "../../../enums/source-level.enum";

@Injectable({
    providedIn: 'root'
})
export class WorkScheduleRepository {
    readonly #http = inject(HttpClient);

    lookUpWorkSchedules(): Observable<IWorkScheduleLookUp[]> {
        return this.#http.get<IWorkScheduleLookUp[]>(APIS.workSchedules.lookUpWorkSchedules);
    }

    getWorkScheduleById(workScheduleId: number): Observable<IWorkSchedule> {
        return this.#http.get<IWorkSchedule>(APIS.workSchedules.getWorkScheduleById(workScheduleId));
    }

    updateWorkSchedule(sourceLevel: SourceLevel, sourceLevelId: number, workSchedule: IWorkSchedule, workScheduleId?: number): Observable<void> {
        if (workScheduleId) {
            return this.#http.put<void>(APIS.workSchedules.updateWorkScheduleWithId(sourceLevel, sourceLevelId, workScheduleId), workSchedule);
        }
        return this.#http.put<void>(APIS.workSchedules.updateWorkScheduleWithoutId(sourceLevel, sourceLevelId), workSchedule);
    }
}
