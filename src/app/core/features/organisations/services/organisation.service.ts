import { inject, Injectable } from "@angular/core";
import { OrganisationRepository } from "../repositories/organisation.repository";
import { Observable } from "rxjs";
import { IOrganisationLookUp } from "../models/organisation-look-up.model";
import { IOrganisationDetails } from "../models/organisation.model";

@Injectable({
    providedIn: 'root'
})
export class OrganisationService {
    readonly #organisationRepository = inject(OrganisationRepository);

    lookUpOrganisations(): Observable<IOrganisationLookUp[]> {
        return this.#organisationRepository.lookUpOrganisations();
    }

    getOrganisationDetailsById(sourceLevelId: number): Observable<IOrganisationDetails> {
        return this.#organisationRepository.getOrganisationDetailsById(sourceLevelId);
    }
}
