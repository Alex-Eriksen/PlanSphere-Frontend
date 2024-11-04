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

    getOrganisationDetailsById(id: number): Observable<IOrganisationDetails> {
        return this.#http.get<IOrganisationDetails>(APIS.organisation.getOrganisationDetailsById(id));
    }

    patch(id: number, bodyRequest: any): Observable<void> {
        return this.#http.patch<void>(APIS.organisation.patch(id), bodyRequest);
    }

    delete(id: number): Observable<void> {
        return this.#http.delete<void>(APIS.organisation.delete(id));
    }
}
