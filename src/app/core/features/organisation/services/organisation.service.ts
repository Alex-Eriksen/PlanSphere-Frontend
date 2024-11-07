import { inject, Injectable } from "@angular/core";
import { OrganisationRepository } from "../repositories/organisation.repository";
import { Observable } from "rxjs";
import { IOrganisationDetails } from "../models/organisation-details.model";

@Injectable({
    providedIn: "root"
})
export class OrganisationService {
    readonly #organisationRepository = inject(OrganisationRepository);

    getOrganisationDetailsById(sourceLevelId: number): Observable<IOrganisationDetails> {
        return this.#organisationRepository.getOrganisationDetailsById(sourceLevelId);
    }

    delete(sourceLevelId: number): Observable<void> {
        return this.#organisationRepository.delete(sourceLevelId);
    }

    patch(sourceLevelId: number, bodyRequest: any): Observable<void> {
        return this.#organisationRepository.patch(sourceLevelId, bodyRequest);
    }
}
