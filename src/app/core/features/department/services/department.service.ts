import { Injectable, inject } from "@angular/core";
import { DepartmentRepository } from "../repositories/department.repository";
import { Observable } from "rxjs";
import { IDepartment } from "../models/department.model";
import { SourceLevel } from "../../../enums/source-level.enum";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { mapDepartmentsToSignalSmallListInputOperator } from "../utilities/department-utilities";
import { IDepartmentRequest } from "../models/department-request.model";

@Injectable({
    providedIn: 'root'
})
export class DepartmentService {
    readonly #departmentRepository = inject(DepartmentRepository)

    departmentById(sourceLevelId: number, sourceLevel: SourceLevel, departmentId: number): Observable<IDepartment> {
        return this.#departmentRepository.getById(sourceLevelId, sourceLevel, departmentId)
    }

    listDepartments(sourceLevelId: number, params: IPaginationSortPayload): Observable<ISignalPaginatedResponse<ISmallListTableInput>> {
        return this.#departmentRepository.listDepartments(sourceLevelId, params).pipe(mapDepartmentsToSignalSmallListInputOperator());
    }

    deleteDepartment(sourceLevelId: number, departmentId: number): Observable<void> {
        return this.#departmentRepository.delete(sourceLevelId, departmentId)
    }

    createDepartment(sourceLevelId: number, departmentRequest: IDepartmentRequest): Observable<void> {
        return this.#departmentRepository.create(sourceLevelId, departmentRequest)
    }

    patch(sourceLevelId: number, bodyRequest: any): Observable<void>{
        return this.#departmentRepository.patch(sourceLevelId, bodyRequest)
    }
}
