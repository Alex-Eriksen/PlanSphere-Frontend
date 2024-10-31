import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class GlobalLoaderService {
    isLoading = false;

    showLoader(): void {
        this.isLoading = true;
    }

    hideLoader(): void {
        this.isLoading = false;
    }
}
