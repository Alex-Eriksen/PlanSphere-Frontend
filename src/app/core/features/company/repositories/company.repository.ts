import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ICompany } from "../models/company.model";
import { APIS } from "../../../api/plansphere.api";
import { ICompanyRequest } from "../models/company-request.model";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";

@Injectable({
    providedIn: 'root'
})
export class CompanyRepository {
    readonly #http = inject(HttpClient);

    getById(id: number): Observable<ICompany> {
        return this.#http.get<ICompany>(APIS.company.getById(id));
    }

    listCompanies(params: IPaginationSortPayload): Observable<IPaginatedResponse> {
        return this.#http.get<IPaginatedResponse>(APIS.company.listCompanies, {
            params: new HttpParams({
                fromObject: { ...params },
            }),
        });
    }

    create(company: ICompanyRequest): Observable<void>{
        return this.#http.post<void>(APIS.company.create, company)
    }

    patch(id: number, bodyRequest: any): Observable<void>{
        return this.#http.patch<void>(APIS.company.patch(id), bodyRequest)
    }

    delete(id: number): Observable<void>{
        return this.#http.delete<void>(APIS.company.delete(id));
    }
}
