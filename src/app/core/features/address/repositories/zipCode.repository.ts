import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IZipCodeLookup } from "../models/zip-code-lookup.model";
import { Observable } from "rxjs";
import { APIS } from "../../../api/plansphere.api";

@Injectable({
    providedIn: "root",
})
export class ZipCodeRepository {
    readonly #http = inject(HttpClient);

    getZipCodeLookups() : Observable<IZipCodeLookup[]> {
        return this.#http.get<IZipCodeLookup[]>(APIS.zipCode.getZipCodeLookups);
    }
}
