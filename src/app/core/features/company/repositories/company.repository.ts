﻿import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { APIS } from "../../../api/plansphere.api";
import { ICompanyRequest } from "../models/company-request.model";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { ICompany } from "../models/company.model";

@Injectable({
    providedIn: 'root'
})
export class CompanyRepository {
    readonly #http = inject(HttpClient);

    getById(sourceLevelId: number, companyId: number): Observable<ICompany> {
        return this.#http.get<ICompany>(APIS.company.getById(sourceLevelId, companyId));
    }

    listCompanies(sourceLevelId: number, params: IPaginationSortPayload, isUserCompanies: boolean): Observable<IPaginatedResponse> {
        const endpoint = isUserCompanies ? APIS.company.listUserCompanies : APIS.company.listCompanies(sourceLevelId);
        return this.#http.get<IPaginatedResponse>(endpoint, {
            params: new HttpParams({
                fromObject: { ...params },
            }),
        });
    }

    create(sourceLevelId: number, company: ICompanyRequest): Observable<void>{
        return this.#http.post<void>(APIS.company.create(sourceLevelId), company)
    }

    patch(sourceLevelId: number, bodyRequest: any): Observable<void>{
        return this.#http.patch<void>(APIS.company.patch(sourceLevelId), bodyRequest)
    }

    delete(sourceLevelId: number, companyId: number): Observable<void>{
        return this.#http.delete<void>(APIS.company.delete(sourceLevelId, companyId));
    }

    uploadLogo(Image: FormData, id: number): Observable<string> {
        return this.#http.post<string>(APIS.company.uploadLogo(id), Image);
    }
}
