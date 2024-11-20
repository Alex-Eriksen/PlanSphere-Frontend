import { inject, Injectable } from "@angular/core";
import { CompanyRepository } from "../repositories/company.repository";
import { Observable } from "rxjs";
import { ICompanyRequest } from "../models/company-request.model";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { mapCompaniesToSignalSmallListInputOperator } from "../utilities/company-utilities";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ICompany } from "../models/company.model";

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    readonly #companyRepository = inject(CompanyRepository);

    companyById(sourceLevelId: number, companyId: number): Observable<ICompany> {
        return  this.#companyRepository.getById(sourceLevelId, companyId)
    }

    listCompanies(sourceLevelId: number, params: IPaginationSortPayload, isUserCompanies: boolean): Observable<ISignalPaginatedResponse<ISmallListTableInput>> {
        return this.#companyRepository.listCompanies(sourceLevelId, params, isUserCompanies).pipe(mapCompaniesToSignalSmallListInputOperator());
    }

    deleteCompany(sourceLevelId: number, companyId: number): Observable<void>{
        return this.#companyRepository.delete(sourceLevelId, companyId)
    }

    createCompany(sourceLevelId: number, companyRequest: ICompanyRequest): Observable<void>{
        return this.#companyRepository.create(sourceLevelId, companyRequest)
    }

    patch(sourceLevelId: number, bodyRequest: any): Observable<void>{
        return this.#companyRepository.patch(sourceLevelId, bodyRequest)
    }

    uploadLogo(data: FormData, id: number): Observable<string>{
        return this.#companyRepository.uploadLogo(data, id);
    }
}
