import { Component, input } from "@angular/core";
import { NgClass } from "@angular/common";
import { SpinnerComponent } from "../spinner/spinner.component";

@Component({
  selector: 'ps-loading-overlay',
  standalone: true,
    imports: [
        NgClass,
        SpinnerComponent
    ],
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss'
})
export class LoadingOverlayComponent {
    appliedClasses = input("");
}
