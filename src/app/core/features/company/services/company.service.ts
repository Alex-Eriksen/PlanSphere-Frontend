import { inject, Injectable } from "@angular/core";
import { CompanyRepository } from "../repositories/company.repository";
import { Observable } from "rxjs";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { mapCompaniesToSignalSmallListInputOperator } from "../utilities/company-utilities";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ICompanyRequest } from "../models/company-request.model";
import { ICompany } from "../models/company.model";

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    readonly #companyRepository = inject(CompanyRepository);

    companyById(id: number): Observable<ICompany> {
        return  this.#companyRepository.getById(id)
    }

    listCompanies(params: IPaginationSortPayload): Observable<ISignalPaginatedResponse<ISmallListTableInput>> {
        return this.#companyRepository.listCompanies(params).pipe(mapCompaniesToSignalSmallListInputOperator());
    }

    delete(id: number): Observable<void>{
        return this.#companyRepository.delete(id)
    }

    create(companyRequest: ICompanyRequest): Observable<void>{
        return this.#companyRepository.create(companyRequest)
    }

    patch(id: number, bodyRequest: any): Observable<void>{
        return this.#companyRepository.patch(id, bodyRequest)
    }

    uploadLogo(data: FormData, id: number): Observable<string>{
        return this.#companyRepository.uploadLogo(data, id);
    }
}
