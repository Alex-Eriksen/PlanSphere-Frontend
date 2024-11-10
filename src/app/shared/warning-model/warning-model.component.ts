import { Component, inject } from "@angular/core";
import { IDialog } from "../interfaces/dialog.interface";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TooltipComponent } from "../tooltip/tooltip.component";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'ps-warning-model',
  standalone: true,
    imports: [
        TooltipComponent,
        TranslateModule,
        ButtonComponent
    ],
  templateUrl: './warning-model.component.html',
  styleUrl: './warning-model.component.scss'
})
export class WarningModelComponent {
    matDialogData: IDialog = inject(MAT_DIALOG_DATA);
    protected dialogRef: MatDialogRef<WarningModelComponent> = inject(MatDialogRef);

    protected cancel = () => this.dialogRef.close(false);
}
