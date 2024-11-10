import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ICompanyLookUp } from "../models/company-look-up.model";
import { APIS } from "../../../api/plansphere.api";

@Injectable({
    providedIn: 'root'
})
export class CompanyRepository {
    readonly #http = inject(HttpClient);

    lookUpCompanies(): Observable<ICompanyLookUp[]> {
        return this.#http.get<ICompanyLookUp[]>(APIS.companies.lookup);
    }
}
