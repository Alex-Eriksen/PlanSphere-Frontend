import { Component } from '@angular/core';
import { TeamListComponent } from "../../../../shared/list-teams/team-list.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'ps-teams',
  standalone: true,
  imports: [
      TeamListComponent,
      RouterOutlet
  ],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent {

}
