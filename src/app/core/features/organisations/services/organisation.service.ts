import { inject, Injectable } from "@angular/core";
import { OrganisationRepository } from "../repositories/organisation.repository";
import { Observable } from "rxjs";
import { IOrganisationLookUp } from "../models/organisation-look-up.model";

@Injectable({
    providedIn: 'root'
})
export class OrganisationService {
    readonly #organisationRepository = inject(OrganisationRepository);

    lookUpOrganisations(): Observable<IOrganisationLookUp[]> {
        return this.#organisationRepository.lookUpOrganisations();
    }
}
