import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { APIS } from "../../../api/plansphere.api";
import { IOrganisationDetails } from "../models/organisation-details.model";

@Injectable({
    providedIn: "root"
})
export class OrganisationRepository {
    readonly #http = inject(HttpClient);

    getOrganisationDetailsById(sourceLevelId: number): Observable<IOrganisationDetails> {
        return this.#http.get<IOrganisationDetails>(APIS.organisation.getOrganisationDetailsById(sourceLevelId));
    }

    patch(sourceLevelId: number, bodyRequest: any): Observable<void> {
        return this.#http.patch<void>(APIS.organisation.patch(sourceLevelId), bodyRequest);
    }

    delete(sourceLevelId: number): Observable<void> {
        return this.#http.delete<void>(APIS.organisation.delete(sourceLevelId));
    }
}
