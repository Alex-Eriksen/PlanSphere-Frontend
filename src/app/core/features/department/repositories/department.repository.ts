﻿import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { IDepartment } from "../models/department.model";
import { APIS } from "../../../api/plansphere.api";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { SourceLevel } from "../../../enums/source-level.enum";
import { IDepartmentLookup } from "../models/department-look-up.model";

@Injectable({
    providedIn: 'root'
})
export class DepartmentRepository {
    readonly #http = inject(HttpClient);

    getById(sourceLevelId: number, sourceLevel: SourceLevel, departmentId: number): Observable<IDepartment> {
        return this.#http.get<IDepartment>(APIS.department.getById(sourceLevelId, sourceLevel, departmentId));
    }

    listDepartments(sourceLevelId: number, params: IPaginationSortPayload, isUserDeparts: boolean): Observable<IPaginatedResponse> {
        const endpoint = isUserDeparts ? APIS.department.listUserDepartments : APIS.department.listDepartments(sourceLevelId);
        return this.#http.get<IPaginatedResponse>(endpoint, {
            params: new HttpParams({
                fromObject: { ...params },
            }),
        });
    }

    create(sourceLevelId: number, department: IDepartment): Observable<void>{
        return this.#http.post<void>(APIS.department.create(sourceLevelId), department)
    }

    patch(sourceLevelId: number, bodyRequest: any): Observable<void>{
        return this.#http.patch<void>(APIS.department.patch(sourceLevelId), bodyRequest)
    }

    delete(sourceLevelId: number, departmentId: number): Observable<void>{
        return this.#http.delete<void>(APIS.department.delete(sourceLevelId, departmentId));
    }

    lookUpDepartments(): Observable<IDepartmentLookup[]> {
        return this.#http.get<IDepartmentLookup[]>(APIS.department.lookUpDepartments);
    }
}
