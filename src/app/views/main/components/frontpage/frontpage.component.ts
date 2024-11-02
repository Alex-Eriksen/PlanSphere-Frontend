import { Component } from '@angular/core';
import { DetailsComponent } from "../company/components/details/details.component";

@Component({
  selector: 'ps-frontpage',
  standalone: true,
    imports: [
        DetailsComponent
    ],
  templateUrl: './frontpage.component.html',
  styleUrl: './frontpage.component.scss'
})
export class FrontpageComponent {

}
