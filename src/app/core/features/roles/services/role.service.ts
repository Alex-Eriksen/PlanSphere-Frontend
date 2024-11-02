import { inject, Injectable } from "@angular/core";
import { SourceLevel } from "../../../enums/source-level.enum";
import { Observable } from "rxjs";
import { RoleRepository } from "../repositories/role.repository";

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    readonly #roleRepository = inject(RoleRepository);

    createRole(sourceLevel: SourceLevel, sourceLevelId: number, body: any): Observable<void> {
        return this.#roleRepository.createRole(sourceLevel, sourceLevelId, body);
    }
}
