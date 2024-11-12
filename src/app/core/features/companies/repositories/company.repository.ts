import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ICompanyLookUp } from "../models/company-look-up.model";
import { APIS } from "../../../api/plansphere.api";
import { ICompany } from "../models/company.model";

@Injectable({
    providedIn: 'root'
})
export class CompanyRepository {
    readonly #http = inject(HttpClient);

    lookUpCompanies(): Observable<ICompanyLookUp[]> {
        return this.#http.get<ICompanyLookUp[]>(APIS.companies.lookup);
    }

    getById(sourceLevelId: number, companyId: number): Observable<ICompany> {
        return this.#http.get<ICompany>(APIS.company.getById(sourceLevelId, companyId));
    }

    patch(sourceLevelId: number, bodyRequest: any): Observable<void>{
        return this.#http.patch<void>(APIS.company.patch(sourceLevelId), bodyRequest)
    }
}
