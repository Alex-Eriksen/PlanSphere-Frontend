import { inject, Injectable } from "@angular/core";
import { CompanyRepository } from "../repositories/company.repository";
import { Observable } from "rxjs";
import { ICompany } from "../models/company.model";
import { ICompanyRequest } from "../models/company-request.model";

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    readonly #companyRepository = inject(CompanyRepository);

    companyById(id: number): Observable<ICompany> {
        return  this.#companyRepository.getById(id)
    }

    delete(id: number): Observable<void>{
        return this.#companyRepository.delete(id)
    }

    create(companyRequest: ICompanyRequest): Observable<void>{
        return this.#companyRepository.create(companyRequest)
    }

    patch(id: number, company: ICompanyRequest): Observable<void>{
        return this.#companyRepository.patch(id, company)
    }
}
