import { Component, input } from "@angular/core";
import { MatTooltip } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'ps-tooltip',
  standalone: true,
    imports: [
        MatTooltip,
        TranslateModule
    ],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent {
    tooltip = input.required<string>();
}
