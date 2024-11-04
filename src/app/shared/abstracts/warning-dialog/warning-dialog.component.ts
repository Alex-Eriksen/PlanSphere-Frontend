import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IDialog } from "../../interfaces/dialog.interface";
import { TooltipComponent } from "../../tooltip/tooltip.component";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonComponent } from "../../button/button.component";

@Component({
  selector: 'ps-warning-dialog',
  standalone: true,
    imports: [
        TooltipComponent,
        TranslateModule,
        ButtonComponent
    ],
  templateUrl: './warning-dialog.component.html',
  styleUrl: './warning-dialog.component.scss'
})
export class WarningDialogComponent {
    matDialogData: IDialog = inject(MAT_DIALOG_DATA);
    protected dialogRef: MatDialogRef<WarningDialogComponent> = inject(MatDialogRef);

    protected cancel = () => this.dialogRef.close(false);
}
