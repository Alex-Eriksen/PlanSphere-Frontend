import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { APIS } from "../../../api/plansphere.api";
import { IOrganisationDetails } from "../models/organisation-details.model";
import { SourceLevel } from "../../../enums/source-level.enum";

@Injectable({
    providedIn: "root"
})
export class OrganisationRepository {
    readonly #http = inject(HttpClient);

    getOrganisationDetailsById(sourceLevel: SourceLevel, sourceLevelId: number): Observable<IOrganisationDetails> {
        return this.#http.get<IOrganisationDetails>(APIS.organisation.getOrganisationDetailsById(sourceLevel, sourceLevelId));
    }

    patch(sourceLevelId: number, bodyRequest: any): Observable<void> {
        return this.#http.patch<void>(APIS.organisation.patch(sourceLevelId), bodyRequest);
    }

    delete(sourceLevel: SourceLevel, sourceLevelId: number): Observable<void> {
        return this.#http.delete<void>(APIS.organisation.delete(sourceLevel, sourceLevelId));
    }
}
