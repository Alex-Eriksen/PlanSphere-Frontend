import { Component } from '@angular/core';
import { DetailsComponent } from "../organisation/components/details/details.component";
import { OrganisationComponent } from "../organisation/organisation.component";

@Component({
  selector: 'ps-frontpage',
  standalone: true,
    imports: [
        DetailsComponent,
        OrganisationComponent
    ],
  templateUrl: './frontpage.component.html',
  styleUrl: './frontpage.component.scss'
})
export class FrontpageComponent {

}
