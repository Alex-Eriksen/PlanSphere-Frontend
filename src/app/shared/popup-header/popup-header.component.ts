import { Component, inject, input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NgClass, NgOptimizedImage } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { TooltipComponent } from "../tooltip/tooltip.component";

@Component({
  selector: 'ps-popup-header',
  standalone: true,
    imports: [
        NgClass,
        TranslateModule,
        TooltipComponent,
        NgOptimizedImage
    ],
  templateUrl: './popup-header.component.html',
  styleUrl: './popup-header.component.scss'
})
export class PopupHeaderComponent {
    label = input.required<string>();
    tooltipLabel = input.required<string>();
    includeExitButton = input<boolean>(false);
    appliedClasses = input<string>("");
    dialog = inject(MatDialog);
    closeDialog(): void {
        this.dialog.closeAll();
    }
}
