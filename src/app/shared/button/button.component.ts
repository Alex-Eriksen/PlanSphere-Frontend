import { booleanAttribute, Component, input } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { SpinnerComponent } from "../spinner/spinner.component";
import { NgClass } from "@angular/common";
import { ButtonStyleType } from "./button-style.type";
import { ImagePositionType } from "./image-position.type";

@Component({
  selector: 'ps-button',
  standalone: true,
    imports: [
        TranslateModule,
        SpinnerComponent,
        NgClass
    ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
    isLoading = input(undefined, { transform: booleanAttribute });
    disabled = input(false, {
        transform: booleanAttribute,
    });
    label = input.required<string>();
    labelCaseSensitiveClass = input<string>("uppercase");
    imageSrc = input<string>();
    imageAlt = input<string>();
    appliedClasses = input<string>("");
    appliedSpinnerClasses = input<string>("!fill-white");
    buttonStyleType = input.required<ButtonStyleType>();
    imagePosition = input<ImagePositionType>("before");
    buttonType = input.required<string>();
}
