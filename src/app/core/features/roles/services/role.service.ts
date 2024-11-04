import { inject, Injectable } from "@angular/core";
import { SourceLevel } from "../../../enums/source-level.enum";
import { Observable } from "rxjs";
import { RoleRepository } from "../repositories/role.repository";
import { IRightLookUp } from "../models/RightLookUp";

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    readonly #roleRepository = inject(RoleRepository);

    createRole(sourceLevel: SourceLevel, sourceLevelId: number, body: any): Observable<void> {
        return this.#roleRepository.createRole(sourceLevel, sourceLevelId, body);
    }

    lookUpRights(): Observable<IRightLookUp[]> {
        return this.#roleRepository.lookUpRights();
    }
}
