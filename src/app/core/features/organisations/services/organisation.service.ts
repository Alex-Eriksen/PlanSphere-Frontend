import { inject, Injectable } from "@angular/core";
import { OrganisationRepository } from "../repositories/organisation.repository";
import { Observable } from "rxjs";
import { IOrganisationLookUp } from "../models/organisation-look-up.model";
import { IOrganisationDetails } from "../models/organisation-details.model";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import {
    mapOrganisationToSignalSmallListInputOperator
} from "../utilities/mapOrganisationToSignalSmallListInputOperator";
import { IOrganisationPayload } from "../models/organisation-payload";

@Injectable({
    providedIn: 'root'
})
export class OrganisationService {
    readonly #organisationRepository = inject(OrganisationRepository);

    createOrganisation(bodyRequest: any): Observable<void> {
        return this.#organisationRepository.createOrganisation(bodyRequest);
    }

    lookUpOrganisations(): Observable<IOrganisationLookUp[]> {
        return this.#organisationRepository.lookUpOrganisations();
    }

    getOrganisationDetailsById(sourceLevelId: number): Observable<IOrganisationDetails> {
        return this.#organisationRepository.getOrganisationDetailsById(sourceLevelId);
    }

    changeOrganisationOwner(userId: number): Observable<void> {
        return this.#organisationRepository.changeOrganisationOwner(userId);
    }

    getListOfOrganisations(params: IPaginationSortPayload): Observable<ISignalPaginatedResponse<ISmallListTableInput>> {
        return this.#organisationRepository.getListOfOrganisations(params).pipe(mapOrganisationToSignalSmallListInputOperator());
    }

    delete(sourceLevelId: number): Observable<void> {
        return this.#organisationRepository.delete(sourceLevelId);
    }

    patch(sourceLevelId: number, bodyRequest: any): Observable<void> {
        return this.#organisationRepository.patch(sourceLevelId, bodyRequest);
    }

    update(sourceLevelId: number, bodyRequest: IOrganisationPayload): Observable<void> {
        return this.#organisationRepository.update(sourceLevelId, bodyRequest);
    }
}
