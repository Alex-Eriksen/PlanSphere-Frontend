import { inject, Injectable, TemplateRef } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { ComponentType } from "@angular/cdk/overlay";
import { IDialog } from "../../shared/interfaces/dialog.interface";
import { DialogType } from "../../shared/types/dialog.type";
import { ConfirmationModelComponent } from "../../shared/confirmation-model/confirmation-model.component";
import { WarningModelComponent } from "../../shared/warning-model/warning-model.component";

@Injectable({ providedIn: "root" })
export class DialogService {
    dialog = inject(MatDialog);
    #currentDialog?: MatDialogRef<any, any>;
    private config: MatDialogConfig = {
        maxHeight: "95dvh",
    };

    open(
        data: IDialog,
        type: DialogType,
        component: ComponentType<any> | TemplateRef<any> = ConfirmationModelComponent,
    ): MatDialogRef<any, any> {
        const chosenComponent = type === "confirmation" ? component : WarningModelComponent;
        this.#currentDialog = this.dialog.open(chosenComponent, {
            ...this.config,
            data: { ...data },
        });
        return this.#currentDialog;
    }

    close(): void {
        this.#currentDialog?.close();
    }
}
