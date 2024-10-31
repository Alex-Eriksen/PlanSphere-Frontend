import { Component, computed, input, numberAttribute } from "@angular/core";
import { NgClass } from "@angular/common";

@Component({
  selector: 'ps-spinner',
  standalone: true,
    imports: [
        NgClass
    ],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
    appliedClasses = input("");
    width = input(25, {
        transform: numberAttribute,
    });
    height = input(25, {
        transform: numberAttribute,
    });
    protected widthPx = computed(() => `${this.width()}px`);
    protected heightPx = computed(() => `${this.height()}px`);
}
