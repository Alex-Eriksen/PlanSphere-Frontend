import { inject, Injectable, TemplateRef } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { ComponentType } from "@angular/cdk/overlay";
import { DialogType } from "../type/dialog.type";
import { IDialog } from "../interfaces/dialog.interface";
import { ConfirmationDialogComponent } from "../abstracts/confirmation-dialog/confirmation-dialog.component";
import { WarningDialogComponent } from "../abstracts/warning-dialog/warning-dialog.component";

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
    component: ComponentType<any> | TemplateRef<any> = ConfirmationDialogComponent,
  ): MatDialogRef<any, any> {
    const chosenComponent = type === "confirmation" ? component : WarningDialogComponent;
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
