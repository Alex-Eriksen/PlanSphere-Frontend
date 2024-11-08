import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
    providedIn: 'root'
})
export class ToastService {
    readonly #snackBar = inject(MatSnackBar);
    readonly #translateService = inject(TranslateService);

    showToast(messageKey: string, config: MatSnackBarConfig = {}): void {
        const defaultConfig: MatSnackBarConfig = {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            ...config
        };

        const message = this.#translateService.instant(messageKey);
        this.#snackBar.open(message, 'Close', defaultConfig);
    }
}
