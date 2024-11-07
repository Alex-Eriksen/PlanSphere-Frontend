import { inject, Injectable } from "@angular/core";
import { OrganisationRepository } from "../repositories/organisation.repository";
import { Observable } from "rxjs";
import { IOrganisationDetails } from "../models/organisation-details.model";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import {
    mapOrganisationToSignelSmallListInputOperator
} from "../utilities/mapOrganisationToSignelSmallListInputOperator";
import { IOrganisationPayload } from "../models/organisation-payload";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";

@Injectable({
    providedIn: "root"
})
export class OrganisationService {
    readonly #organisationRepository = inject(OrganisationRepository);

    createOrganisation(bodyRequest: any): Observable<void> {
        return this.#organisationRepository.createOrganisation(bodyRequest);
    }

    getOrganisationDetailsById(sourceLevelId: number): Observable<IOrganisationDetails> {
        return this.#organisationRepository.getOrganisationDetailsById(sourceLevelId);
    }

    getListOfOrganisations(params: IPaginationSortPayload): Observable<ISignalPaginatedResponse<ISmallListTableInput>> {
        return this.#organisationRepository.getListOfOrganisations(params).pipe(mapOrganisationToSignelSmallListInputOperator());
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
