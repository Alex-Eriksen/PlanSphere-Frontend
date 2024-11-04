import { inject, Injectable } from "@angular/core";
import { OrganisationRepository } from "../repositories/organisation.repository";
import { Observable } from "rxjs";
import { IOrganisationDetails } from "../models/organisation-details.model";

@Injectable({
    providedIn: "root"
})
export class OrganisationService {
    readonly #organisationRepository = inject(OrganisationRepository);

    public getOrganisationDetailsById(id: number): Observable<IOrganisationDetails> {
        return this.#organisationRepository.getOrganisationDetailsById(id);
    }

    delete(id: number): Observable<void> {
        return this.#organisationRepository.delete(id);
    }

    patch(id: number, bodyRequest: any): Observable<void> {
        return this.#organisationRepository.patch(id, bodyRequest);
    }
}
