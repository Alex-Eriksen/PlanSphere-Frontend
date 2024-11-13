import { Component, input } from "@angular/core";
import { RolesViewComponent } from "../../../../../../shared/roles-view/roles-view.component";
import { SourceLevel } from "../../../../../../core/enums/source-level.enum";
import { IRightsListener } from "../../../../../../core/interfaces/rights-data.interface";
import { ISourceLevelRights } from "../../../../../../core/features/authentication/models/source-level-rights.model";

@Component({
  selector: 'ps-roles',
  standalone: true,
    imports: [
        RolesViewComponent
    ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements IRightsListener {
    departmentId = input.required<number>();
    sourceLevel = SourceLevel.Department;
    hasEditRights = false;

    setRightsData(rights: ISourceLevelRights) {
        this.hasEditRights = rights.hasAdministratorRights || rights.hasEditRights;
    }
}
