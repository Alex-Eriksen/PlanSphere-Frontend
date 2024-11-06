import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IOrganisationLookUp } from "../models/organisation-look-up.model";
import { APIS } from "../../../api/plansphere.api";

@Injectable({
    providedIn: 'root'
})
export class OrganisationRepository {
    readonly #http = inject(HttpClient);

    lookUpOrganisations(): Observable<IOrganisationLookUp[]> {
        return this.#http.get<IOrganisationLookUp[]>(APIS.organisations.lookUp);
    }
}
