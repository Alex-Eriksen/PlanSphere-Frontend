import { Component } from '@angular/core';
import { SpinnerComponent } from "../spinner/spinner.component";

@Component({
  selector: 'ps-global-loader',
  standalone: true,
    imports: [SpinnerComponent],
  template: `
     <div class="fixed inset-0 z-50 flex justify-center items-center bg-white">
        <ps-spinner width="40" height="40" />
    </div>
  `,
  styles: ''
})
export class GlobalLoaderComponent { }
