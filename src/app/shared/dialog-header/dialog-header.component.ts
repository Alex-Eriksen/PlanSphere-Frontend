import { Component, inject, input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { NgClass } from "@angular/common";
import { TooltipComponent } from "../tooltip/tooltip.component";

@Component({
  selector: 'ps-dialog-header',
  standalone: true,
    imports: [
        TranslateModule,
        NgClass,
        TooltipComponent
    ],
  templateUrl: './dialog-header.component.html',
  styleUrl: './dialog-header.component.scss'
})
export class DialogHeaderComponent {
    label = input.required<string>();
    tooltipLabel = input.required<string>();
    includeExitButton = input<boolean>(false);
    appliedClasses = input<string>("");
    dialog = inject(MatDialog);
    closeDialog(): void {
        this.dialog.closeAll();
    }
}
