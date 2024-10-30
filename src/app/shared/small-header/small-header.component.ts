import { Component, input } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { NgClass } from "@angular/common";
import { TooltipComponent } from "../tooltip/tooltip.component";

@Component({
  selector: 'ps-small-header',
  standalone: true,
    imports: [
        TranslateModule,
        NgClass,
        TooltipComponent
    ],
  templateUrl: './small-header.component.html',
  styleUrl: './small-header.component.scss'
})
export class SmallHeaderComponent {
    heading = input.required<string>();
    subheading = input<string>();
    tooltip = input<string>();
    appliedClasses = input("");
    subheadingAppliedClasses = input("");
}
