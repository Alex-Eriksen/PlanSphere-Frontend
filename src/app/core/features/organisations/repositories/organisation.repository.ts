import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IOrganisationLookUp } from "../models/organisation-look-up.model";
import { APIS } from "../../../api/plansphere.api";
import { IOrganisationDetails } from "../models/organisation.model";

@Injectable({
    providedIn: 'root'
})
export class OrganisationRepository {
    readonly #http = inject(HttpClient);

    lookUpOrganisations(): Observable<IOrganisationLookUp[]> {
        return this.#http.get<IOrganisationLookUp[]>(APIS.organisations.lookUp);
    }

    getOrganisationDetailsById(sourceLevelId: number): Observable<IOrganisationDetails> {
        return this.#http.get<IOrganisationDetails>(APIS.organisation.getOrganisationDetailsById(sourceLevelId));
    }
}
