import { Component, input } from "@angular/core";
import { DepartmentListComponent } from "../../../../../../shared/list-department/department-list.component";
import { IRightsListener } from "../../../../../../core/interfaces/rights-data.interface";
import { ISourceLevelRights } from "../../../../../../core/features/authentication/models/source-level-rights.model";

@Component({
  selector: 'ps-departments',
  standalone: true,
    imports: [
        DepartmentListComponent
    ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent implements IRightsListener {
    companyId = input.required<number>();
    hasEditRights = false;

    setRightsData(rights: ISourceLevelRights) {
        this.hasEditRights = rights.hasAdministratorRights || rights.hasEditRights;
    }
}
