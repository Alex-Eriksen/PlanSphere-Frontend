import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'  // Makes this service globally available
})
export class ToastService {
    readonly #snackBar = inject(MatSnackBar);
    showToast(message: string, config: MatSnackBarConfig = {}): void {
        const defaultConfig: MatSnackBarConfig = {
            duration: 3000,  // default duration of 3 seconds
            verticalPosition: 'top',
            horizontalPosition: 'center',
            ...config
        };

        this.#snackBar.open(message, 'Close', defaultConfig);
    }
}
