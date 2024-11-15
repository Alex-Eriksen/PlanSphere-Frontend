import { Component, input } from "@angular/core";
import { IRightsListener } from "../../../../../../core/interfaces/rights-data.interface";
import { TeamListComponent } from "../../../../../../shared/list-teams/team-list.component";
import { ISourceLevelRights } from "../../../../../../core/features/authentication/models/source-level-rights.model";

@Component({
  selector: 'ps-teams',
  standalone: true,
    imports: [
        TeamListComponent,
    ],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements IRightsListener {
    departmentId = input.required<number>();
    hasEditRights = false;

    setRightsData(rights: ISourceLevelRights) {
        this.hasEditRights = rights.hasAdministratorRights || rights.hasEditRights;
    }
}
