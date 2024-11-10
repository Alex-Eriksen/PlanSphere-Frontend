import { Component, input } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { TooltipComponent } from "../tooltip/tooltip.component";
import { NgClass } from "@angular/common";

@Component({
  selector: 'ps-sub-header',
  standalone: true,
    imports: [
        TranslateModule,
        TooltipComponent,
        NgClass
    ],
  templateUrl: './sub-header.component.html',
  styleUrl: './sub-header.component.scss'
})
export class SubHeaderComponent {
    label = input.required<string>();
    tooltip = input.required<string>();
    appliedClasses = input("");
}
