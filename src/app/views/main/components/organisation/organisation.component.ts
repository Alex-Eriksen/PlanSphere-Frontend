import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'ps-organisation',
  standalone: true,
    imports: [
        RouterOutlet
    ],
  templateUrl: './organisation.component.html',
  styleUrl: './organisation.component.scss'
})
export class OrganisationComponent {

}
