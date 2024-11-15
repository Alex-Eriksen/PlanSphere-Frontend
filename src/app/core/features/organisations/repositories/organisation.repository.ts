import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { IOrganisationLookUp } from "../models/organisation-look-up.model";
import { APIS } from "../../../api/plansphere.api";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { IOrganisationPayload } from "../models/organisation-payload";
import { IOrganisationDetails } from "../models/organisation-details.model";

@Injectable({
    providedIn: 'root'
})
export class OrganisationRepository {
    readonly #http = inject(HttpClient);

    createOrganisation(bodyRequest: any): Observable<void> {
        return this.#http.post<void>(APIS.organisation.createOrganisation(), bodyRequest);
    }

    lookUpOrganisations(): Observable<IOrganisationLookUp[]> {
        return this.#http.get<IOrganisationLookUp[]>(APIS.organisations.lookUp);
    }

    getOrganisationDetailsById(sourceLevelId: number): Observable<IOrganisationDetails> {
        return this.#http.get<IOrganisationDetails>(APIS.organisation.getOrganisationDetailsById(sourceLevelId));
    }

    changeOrganisationOwner(userId: number): Observable<void>{
        return this.#http.post<void>(APIS.organisations.changeOwnership(userId), {});
    }

    lookUpOrganisations(): Observable<IOrganisationLookUp[]> {
        return this.#http.get<IOrganisationLookUp[]>(APIS.organisations.lookUp);
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
