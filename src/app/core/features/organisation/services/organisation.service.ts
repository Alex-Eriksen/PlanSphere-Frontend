import { inject, Injectable } from "@angular/core";
import { OrganisationRepository } from "../repositories/organisation.repository";
import { Observable } from "rxjs";
import { IOrganisationDetails } from "../models/organisation-details.model";
import { SourceLevel } from "../../../enums/source-level.enum";

@Injectable({
    providedIn: "root"
})
export class OrganisationService {
    readonly #organisationRepository = inject(OrganisationRepository);

    getOrganisationDetailsById(sourceLevel: SourceLevel, sourceLevelId: number): Observable<IOrganisationDetails> {
        return this.#organisationRepository.getOrganisationDetailsById(sourceLevel, sourceLevelId);
    }

    delete(sourceLevel: SourceLevel, sourceLevelId: number): Observable<void> {
        return this.#organisationRepository.delete(sourceLevel, sourceLevelId);
    }

    patch(sourceLevelId: number, bodyRequest: any): Observable<void> {
        return this.#organisationRepository.patch(sourceLevelId, bodyRequest);
    }
}
