import { inject, Injectable } from "@angular/core";
import { CompanyRepository } from "../repositories/company.repository";
import { Observable } from "rxjs";
import { ICompanyLookUp } from "../models/company-look-up.model";

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    readonly #companyRepository = inject(CompanyRepository);

    lookUpCompanies(): Observable<ICompanyLookUp[]> {
        return this.#companyRepository.lookUpCompanies();
    }
}
