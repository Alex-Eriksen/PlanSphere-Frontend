import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IWorkScheduleLookUp } from "../models/work-schedule-look-up.model";
import { APIS } from "../../../api/plansphere.api";

@Injectable({
    providedIn: 'root'
})
export class WorkScheduleRepository {
    readonly #http = inject(HttpClient);

    lookUpWorkSchedules(): Observable<IWorkScheduleLookUp[]> {
        return this.#http.get<IWorkScheduleLookUp[]>(APIS.workSchedules.lookUpWorkSchedules);
    }
}
