import { Component, input, output } from "@angular/core";
import { MatSlideToggle, MatSlideToggleChange } from "@angular/material/slide-toggle";
import { TranslateModule } from "@ngx-translate/core";
import { FormControl } from "@angular/forms";
import { NgClass } from "@angular/common";
import { markControlAsTouchedAndDirty } from "../utilities/form.utilities";
import { TooltipComponent } from "../tooltip/tooltip.component";

@Component({
  selector: 'ps-toggle-input',
  standalone: true,
    imports: [
        MatSlideToggle,
        TranslateModule,
        NgClass,
        TooltipComponent
    ],
  templateUrl: './toggle-input.component.html',
  styleUrl: './toggle-input.component.scss'
})
export class ToggleInputComponent {
    control = input<FormControl<boolean>>(new FormControl());
    label = input<string>("");
    translationArgs = input({});
    tooltip = input<string>("");
    appliedClasses = input<string>("");
    toggleChanged = output<boolean>();

    toggle(value: MatSlideToggleChange) {
        this.control().patchValue(value.checked);
        markControlAsTouchedAndDirty(this.control());
        this.toggleChanged.emit(value.checked);
    }
}
