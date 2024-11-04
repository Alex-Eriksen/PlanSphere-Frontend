import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ICompany } from "../models/company.model";
import { APIS } from "../../../api/plansphere.api";
import { ICompanyRequest } from "../models/company-request.model";

@Injectable({
    providedIn: 'root'
})
export class CompanyRepository {
    readonly #http = inject(HttpClient);

    getById(id: number): Observable<ICompany> {
        return this.#http.get<ICompany>(APIS.company.getById(id));
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
