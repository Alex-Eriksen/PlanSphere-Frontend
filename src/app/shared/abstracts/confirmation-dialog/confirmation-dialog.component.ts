import { Component, inject } from "@angular/core";
import { IDialog } from "../../interfaces/dialog.interface";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ButtonComponent } from "../../button/button.component";
import { TranslateModule } from "@ngx-translate/core";
import { TooltipComponent } from "../../tooltip/tooltip.component";
import { SlicePipe } from "@angular/common";
import { InputComponent } from "../../input/input.component";

@Component({
  selector: 'ps-confirmation-dialog',
  standalone: true,
    imports: [
        ButtonComponent,
        TranslateModule,
        TooltipComponent,
        SlicePipe,
        InputComponent
    ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
    matDialogData: IDialog = inject(MAT_DIALOG_DATA);
    protected dialogRef: MatDialogRef<ConfirmationDialogComponent> = inject(MatDialogRef);

    protected cancel = () => this.dialogRef.close(false);
}
