import { Component, inject } from "@angular/core";
import { IDialog } from "../interfaces/dialog.interface";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ButtonComponent } from "../button/button.component";
import { InputComponent } from "../input/input.component";
import { SlicePipe } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { TooltipComponent } from "../tooltip/tooltip.component";

@Component({
  selector: 'ps-confirmation-model',
  standalone: true,
    imports: [
        ButtonComponent,
        InputComponent,
        SlicePipe,
        TranslateModule,
        TooltipComponent
    ],
  templateUrl: './confirmation-model.component.html',
  styleUrl: './confirmation-model.component.scss'
})
export class ConfirmationModelComponent {
    matDialogData: IDialog = inject(MAT_DIALOG_DATA);
    protected dialogRef: MatDialogRef<ConfirmationModelComponent> = inject(MatDialogRef);

    protected cancel = () => this.dialogRef.close(false);
}
