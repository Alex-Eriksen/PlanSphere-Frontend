import { Component } from '@angular/core';
import { SmallHeaderComponent } from "../../../../../../shared/small-header/small-header.component";

@Component({
  selector: 'ps-details',
  standalone: true,
    imports: [
        SmallHeaderComponent
    ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {

}
