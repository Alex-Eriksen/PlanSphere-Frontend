import { Component, input, model } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { TranslateModule } from "@ngx-translate/core";
import { MatInput } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { VALIDATION_ERROR_KEY, VAT_NUMBER_NOT_EXISTS_ERROR_KEY } from "../constants/error-keys.constants";
import { TooltipComponent } from "../tooltip/tooltip.component";

@Component({
  selector: 'ps-input',
  standalone: true,
    imports: [
        MatFormField,
        TranslateModule,
        MatInput,
        ReactiveFormsModule,
        MatError,
        MatIcon,
        MatLabel,
        FormsModule,
        TooltipComponent
    ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
    label = input.required<string>();
    tooltip = input<string>("");
    control = input<FormControl>();
    placeholder = input<string>("");
    type = input<string>("text");
    value = model<string>("");

    protected readonly INVALID_VAT_NUMBER_ERROR_KEY = VAT_NUMBER_NOT_EXISTS_ERROR_KEY;
    protected readonly VAT_NUMBER_NOT_EXISTS_ERROR_KEY = VAT_NUMBER_NOT_EXISTS_ERROR_KEY;
    protected readonly VALIDATION_ERROR_KEY = VALIDATION_ERROR_KEY;
}
