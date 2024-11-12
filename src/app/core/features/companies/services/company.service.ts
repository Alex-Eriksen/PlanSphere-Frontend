import { inject, Injectable } from "@angular/core";
import { CompanyRepository } from "../repositories/company.repository";
import { Observable } from "rxjs";
import { ICompanyLookUp } from "../models/company-look-up.model";
import { ICompany } from "../models/company.model";

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    readonly #companyRepository = inject(CompanyRepository);

    lookUpCompanies(): Observable<ICompanyLookUp[]> {
        return this.#companyRepository.lookUpCompanies();
    }

    companyById(sourceLevelId: number, companyId: number): Observable<ICompany> {
        return  this.#companyRepository.getById(sourceLevelId, companyId)
    }

    patch(sourceLevelId: number, bodyRequest: any): Observable<void>{
        return this.#companyRepository.patch(sourceLevelId, bodyRequest)
    }
}
