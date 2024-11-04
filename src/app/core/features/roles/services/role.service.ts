import { inject, Injectable } from "@angular/core";
import { SourceLevel } from "../../../enums/source-level.enum";
import { Observable } from "rxjs";
import { RoleRepository } from "../repositories/role.repository";
import { IRightLookUp } from "../models/RightLookUp";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { mapRolesToSignalSmallListInputOperator } from "../utilties/role.utilities";

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    readonly #roleRepository = inject(RoleRepository);

    createRole(sourceLevel: SourceLevel, sourceLevelId: number, body: any): Observable<void> {
        return this.#roleRepository.createRole(sourceLevel, sourceLevelId, body);
    }

    getRoles(
        params: IPaginationSortPayload,
        sourceLevel: SourceLevel,
        sourceLevelId: number
    ): Observable<ISignalPaginatedResponse<ISmallListTableInput>> {
        return this.#roleRepository.getPaginatedRoles(params, sourceLevel, sourceLevelId).pipe(mapRolesToSignalSmallListInputOperator());
    }

    lookUpRights(): Observable<IRightLookUp[]> {
        return this.#roleRepository.lookUpRights();
    }
}
