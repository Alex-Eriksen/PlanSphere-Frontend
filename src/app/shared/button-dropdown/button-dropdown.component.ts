import { Component, input, ViewChild } from "@angular/core";
import { MatOption, MatSelect, MatSelectTrigger } from "@angular/material/select";
import { ButtonComponent } from "../button/button.component";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { IDropdownOption } from "../interfaces/dropdown-option.interface";
import { ImagePositionType } from "../button/image-position.type";
import { ButtonStyleType } from "../button/button-style.type";
import { MatDivider } from "@angular/material/divider";
import { NgClass } from "@angular/common";

@Component({
  selector: 'ps-button-dropdown',
  standalone: true,
    imports: [
        MatSelect,
        MatSelectTrigger,
        ButtonComponent,
        ReactiveFormsModule,
        MatOption,
        MatDivider,
        NgClass
    ],
  templateUrl: './button-dropdown.component.html',
  styleUrl: './button-dropdown.component.scss'
})
export class ButtonDropdownComponent {
    label = input.required<string>();
    labelCaseSensitiveClass = input<string>("uppercase");
    imageSrc = input<string>();
    imageAlt = input<string>();
    appliedClasses = input<string>("");
    buttonStyleType = input.required<ButtonStyleType>();
    imagePosition = input<ImagePositionType>("before");
    buttonType = input.required<string>();
    options = input.required<IDropdownOption[]>();
    control = input<FormControl>(new FormControl());
    isMultiSelect = input<boolean>(false);

    @ViewChild("dropdownMenu") dropdownMenu!: MatSelect;

    protected toggleDropdown() {
        this.dropdownMenu.toggle();
    }
}
