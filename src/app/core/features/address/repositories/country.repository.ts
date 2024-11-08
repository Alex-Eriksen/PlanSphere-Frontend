import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ICountryLookup } from "../models/country-lookup.model";
import { APIS } from "../../../api/plansphere.api";

@Injectable({
    providedIn: "root",
})
export class CountryRepository {
    readonly #http = inject(HttpClient);

    getCountryLookups() : Observable<ICountryLookup[]> {
        return this.#http.get<ICountryLookup[]>(APIS.country.getCountryLookups);
    }
}
