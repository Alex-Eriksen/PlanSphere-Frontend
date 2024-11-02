import { Component, input } from "@angular/core";
import { NgClass } from "@angular/common";

@Component({
  selector: 'ps-line',
  standalone: true,
    imports: [
        NgClass
    ],
  template: `
      <hr class="border-black-200 absolute start-0 end-0" [ngClass]="appliedClasses()"/>
  `,
  styles: ''
})
export class LineComponent {
    appliedClasses = input("");
}
