import { inject, Injectable } from "@angular/core";
import { SourceLevel } from "../../../enums/source-level.enum";
import { map, Observable } from "rxjs";
import { RoleRepository } from "../repositories/role.repository";
import { IRightLookUp } from "../models/right-look-up.model";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { mapRolesToSignalSmallListInputOperator, mapRoleToDropdownOptions } from "../utilties/role.utilities";
import { IRole } from "../models/role.model";
import { IDropdownOption } from "../../../../shared/interfaces/dropdown-option.interface";

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

    lookUpRoles(sourceLevel: SourceLevel, sourceLevelId: number): Observable<IDropdownOption[]> {
        return this.#roleRepository.lookUpRoles(sourceLevel, sourceLevelId).pipe(
            map((option) => {
                return mapRoleToDropdownOptions(option);
            })
        )
    }

    lookUpRights(): Observable<IRightLookUp[]> {
        return this.#roleRepository.lookUpRights();
    }

    deleteRole(sourceLevel: SourceLevel, sourceLevelId: number, roleId: number) : Observable<void> {
        return this.#roleRepository.deleteRole(sourceLevel, sourceLevelId, roleId);
    }

    updateRole(sourceLevel: SourceLevel, sourceLevelId: number, roleId: number, body: any): Observable<void> {
        return this.#roleRepository.updateRole(sourceLevel, sourceLevelId, roleId, body);
    }

    getById(sourceLevel: SourceLevel, sourceLevelId: number, roleId: number): Observable<IRole> {
        return this.#roleRepository.getById(sourceLevel, sourceLevelId, roleId);
    }

    toggleRoleInheritance(sourceLevel: SourceLevel, sourceLevelId: number,  roleId: number): Observable<void> {
        return this.#roleRepository.toggleRoleInheritance(sourceLevel, sourceLevelId, roleId);
    }
}
