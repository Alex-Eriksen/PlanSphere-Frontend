import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { APIS } from "../../../api/plansphere.api";
import { IOrganisationDetails } from "../models/organisation-details.model";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { IOrganisationPayload } from "../models/organisation-payload";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";

@Injectable({
    providedIn: "root"
})
export class OrganisationRepository {
    readonly #http = inject(HttpClient);

    createOrganisation(bodyRequest: any): Observable<void> {
        return this.#http.post<void>(APIS.organisation.createOrganisation(), bodyRequest);
    }

    getOrganisationDetailsById(sourceLevelId: number): Observable<IOrganisationDetails> {
        return this.#http.get<IOrganisationDetails>(APIS.organisation.getOrganisationDetailsById(sourceLevelId));
    }

    getListOfOrganisations(params: IPaginationSortPayload): Observable<IPaginatedResponse> {
        return this.#http.get<IPaginatedResponse>(APIS.organisation.getListOfOrganisations(), {
            params: new HttpParams({
                fromObject: { ...params },
            })
        });
    }

    patch(sourceLevelId: number, bodyRequest: any): Observable<void> {
        return this.#http.patch<void>(APIS.organisation.patch(sourceLevelId), bodyRequest);
    }

    delete(sourceLevelId: number): Observable<void> {
        return this.#http.delete<void>(APIS.organisation.delete(sourceLevelId));
    }

    update(sourceLevelId: number, bodyRequest: IOrganisationPayload): Observable<void> {
        return this.#http.put<void>(APIS.organisation.update(sourceLevelId), bodyRequest);
    }
}
